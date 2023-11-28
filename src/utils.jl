#####################################################################
#####                       JSON OUTPUT                          ####
#####################################################################

initialize_json(filename::Nothing) = nothing

initialize_json(filename::String) = open(filename, "w") do io
    print(io, '[')
end

function update_file(output::JSONOutput, results; finalize=false)
    output.filename === nothing && return
    open(output.filename, "a") do io
        for result in results
            result = TMLE.emptyIC(result, output.pval_threshold)
            JSON.print(io, TMLE.to_dict(result))
            print(io, ',')
        end
        if finalize
            skip(io, -1) # get rid of the last comma which JSON doesn't allow
            print(io, ']')
        end
    end
end

#####################################################################
#####                       STD OUTPUT                          ####
#####################################################################

function update_file(doprint, results, partition)
    if doprint
        mimetext = MIME"text/plain"()
        index = 1
        for (result, estimand_index) in zip(results, partition)
            show(stdout, mimetext, string("⋆⋆⋆ Estimand ", estimand_index, " ⋆⋆⋆"))
            println(stdout)
            show(stdout, mimetext, first(result).estimand)
            for (key, val) ∈ zip(keys(result), result)
                show(stdout, mimetext, string("→ Estimation Result From: ", key, ))
                println(stdout)
                show(stdout, mimetext, val)
                index += 1
            end
        end
    end
end

#####################################################################
#####                       HDF5 OUTPUT                          ####
#####################################################################

function update_file(output::HDF5Output, results, dataset)
    output.filename === nothing && return
    results = post_process(results, dataset, output.pval_threshold, output.save_sample_ids)
    jldopen(output.filename, "a+", compress=output.compress) do io
        latest_index = maximum(parse(Int, split(key, "_")[2]) for key in keys(io))
        io[string("Batch_", latest_index + 1)] = results
    end
end

#####################################################################
#####                        JLS OUTPUT                          ####
#####################################################################

function update_file(output::JLSOutput, results, dataset)
    output.filename === nothing && return
    results = post_process(results, dataset, output.pval_threshold, output.save_sample_ids)

    open(output.filename, "a") do io
        for result in results
            serialize(io, result)
        end
    end
end

#####################################################################
#####                    Read TMLE Estimands Configuration                         ####
#####################################################################

function convert_treatment_values(treatment_levels::NamedTuple{names, <:Tuple{Vararg{NamedTuple}}}, treatment_types) where names
    return [(
        case = convert(treatment_types[tn], treatment_levels[tn].case), 
        control = convert(treatment_types[tn], treatment_levels[tn].control)
    ) 
        for tn in names]
end

convert_treatment_values(treatment_levels::NamedTuple{names,}, treatment_types) where names = 
    [convert(treatment_types[tn], treatment_levels[tn]) for tn in names]

MissingSCMError() = ArgumentError(string("A Structural Causal Model should be provided in the configuration file in order to identify causal estimands."))

get_identification_method(method::Nothing) = BackdoorAdjustment()
get_identification_method(method) = method

maybe_identify(Ψ::TMLE.CausalCMCompositeEstimands, scm::SCM, method) = 
    identify(get_identification_method(method), Ψ, scm)

maybe_identify(Ψ::TMLE.CausalCMCompositeEstimands, scm::Nothing, method) = throw(MissingSCMError())

function maybe_identify(Ψ::TMLE.ComposedEstimand, scm, method)
    method = get_identification_method(method)
    return TMLE.ComposedEstimand(Ψ.f, Tuple(maybe_identify(arg, scm, method) for arg ∈ Ψ.args))
end

maybe_identify(Ψ, scm, method) = Ψ

function read_method(extension)
    method = if extension == ".json"
        TMLE.read_json
    elseif extension == ".yaml"
        TMLE.read_yaml
    elseif extension == ".jls"
        deserialize
    else
        throw(ArgumentError(string("Can't read from ", extension, " file")))
    end
    return method
end

function fix_treatment_values!(treatment_types::AbstractDict, Ψ::ComposedEstimand, dataset)
    new_args = Tuple(fix_treatment_values!(treatment_types, arg, dataset) for arg in Ψ.args)
    return ComposedEstimand(Ψ.f, new_args)
end

"""
Uses the values found in the dataset to create a new estimand with adjusted values.
"""
function fix_treatment_values!(treatment_types::AbstractDict, Ψ, dataset)
    treatment_names = keys(Ψ.treatment_values)
    for tn in treatment_names
        haskey(treatment_types, tn) ? nothing : treatment_types[tn] = eltype(dataset[!, tn])
    end
    new_treatment = NamedTuple{treatment_names}(
        convert_treatment_values(Ψ.treatment_values, treatment_types)
    )
    return typeof(Ψ)(
        outcome = Ψ.outcome,
        treatment_values = new_treatment,
        treatment_confounders = Ψ.treatment_confounders,
        outcome_extra_covariates = Ψ.outcome_extra_covariates
    )
end

"""
    proofread_estimands(param_file, dataset)

Reads estimands from file and ensures that the treatment values in the config file
respects the treatment types in the dataset.
"""
function proofread_estimands(filename, dataset)
    extension = filename[findlast(isequal('.'), filename):end]
    config = read_method(extension)(filename)
    estimands = Vector{TMLE.Estimand}(undef, length(config.estimands))
    treatment_types = Dict()
    for (index, Ψ) in enumerate(config.estimands)
        statisticalΨ = TargetedEstimation.maybe_identify(Ψ, config.scm, config.adjustment)
        estimands[index] = fix_treatment_values!(treatment_types, statisticalΨ, dataset)
    end
    return estimands
end

#####################################################################
#####                 ADDITIONAL METHODS                         ####
#####################################################################

TMLE.emptyIC(result::FailedEstimation, pval_threshold) = result

TMLE.emptyIC(nt::NamedTuple{names}, pval_threshold) where names =
    NamedTuple{names}([TMLE.emptyIC(result, pval_threshold) for result in nt])

function post_process(results, dataset, pval_threshold, save_sample_ids)
    results = [TMLE.emptyIC(result, pval_threshold) for result ∈ results]
    if save_sample_ids
        sample_ids = get_sample_ids(dataset, results)
        results = [(result..., SAMPLE_IDS=s_ids) for (result, s_ids) in zip(results, sample_ids)]
    end
    return results
end

sample_ids_from_variables(dataset, variables) = dropmissing(dataset[!, [:SAMPLE_ID, variables...]]).SAMPLE_ID

function get_sample_ids(dataset, results)
    previous_variables = nothing
    sample_ids = []
    current_ref_id = 0
    for (index, result) in enumerate(results)
        current_variables = variables(first(result).estimand)
        if previous_variables != current_variables
            push!(sample_ids, sample_ids_from_variables(dataset, current_variables))
            current_ref_id = index
        else
            push!(sample_ids, current_ref_id)
        end
    end
    return sample_ids
end

"""
    instantiate_dataset(path::String)

Returns a DataFrame wrapper around a dataset, either in CSV format.
"""
instantiate_dataset(path::String) =
    endswith(path, ".csv") ? CSV.read(path, DataFrame, ntasks=1) : DataFrame(Arrow.Table(path))

isbinary(col, dataset) = Set(unique(skipmissing(dataset[!, col]))) == Set([0, 1])

make_categorical(x::CategoricalVector, ordered) = x
make_categorical(x, ordered) = categorical(x, ordered=ordered)

function make_categorical!(dataset, colname::Union{String, Symbol}; infer_ordered=false)
    ordered = false
    if infer_ordered
        ordered = eltype(dataset[!, colname]) <: Real
    end
    dataset[!, colname] = make_categorical(dataset[!, colname], ordered)
end

function make_categorical!(dataset, colnames; infer_ordered=false)
    for colname in colnames
        make_categorical!(dataset, colname;infer_ordered=infer_ordered)
    end
end

make_float(x) = float(x)

make_float!(dataset, colname::Union{String, Symbol}) = 
    dataset[!, colname] = make_float(dataset[!, colname])

function make_float!(dataset, colnames)
    for colname in colnames
        make_float!(dataset, colname)
    end
end

function coerce_types!(dataset, Ψ::ComposedEstimand)
    for arg in Ψ.args
        coerce_types!(dataset, arg)
    end
end

function coerce_types!(dataset, Ψ)
    categorical_variables = Set(keys(Ψ.treatment_values))
    continuous_variables = Set(Iterators.flatten(values(Ψ.treatment_confounders)))
    union!(continuous_variables, Ψ.outcome_extra_covariates) 
    TMLE.is_binary(dataset, Ψ.outcome) ? 
        push!(categorical_variables, Ψ.outcome) : 
        push!(continuous_variables, Ψ.outcome)
    make_categorical!(dataset, categorical_variables, infer_ordered=true)
    make_float!(dataset, continuous_variables)
end

variables(Ψ::TMLE.Estimand) = Set([
    Ψ.outcome,
    keys(Ψ.treatment_values)...,
    Ψ.outcome_extra_covariates..., 
    Iterators.flatten(values(Ψ.treatment_confounders))...
    ])

load_tmle_spec(file::Nothing) = (
    TMLE = TMLEE(
        models = TMLE.default_models(
            Q_binary = LogisticClassifier(lambda=0.),
            Q_continuous = LinearRegressor(),
            G = LogisticClassifier(lambda=0.)
        ),
        weighted = true, 
        ),
    )

function load_tmle_spec(file)
    include(abspath(file))
    return ESTIMATORS
end

TMLE.to_dict(nt::NamedTuple{names, <:Tuple{Vararg{TMLE.EICEstimate}}}) where names = 
    Dict(key => TMLE.to_dict(val) for (key, val) ∈ zip(keys(nt), nt))

TMLE.to_dict(nt::NamedTuple{names, <:Tuple{Vararg{FailedEstimation}}}) where names = 
    Dict(key => TMLE.to_dict(val) for (key, val) ∈ zip(keys(nt), nt))