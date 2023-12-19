var documenterSearchIndex = {"docs":
[{"location":"cli/#The-Command-Line-Interface-(CLI)","page":"The Command Line Interface (CLI)","title":"The Command Line Interface (CLI)","text":"","category":"section"},{"location":"cli/#CLI-Installation","page":"The Command Line Interface (CLI)","title":"CLI Installation","text":"","category":"section"},{"location":"cli/#Via-Docker-(requires-Docker)","page":"The Command Line Interface (CLI)","title":"Via Docker (requires Docker)","text":"","category":"section"},{"location":"cli/","page":"The Command Line Interface (CLI)","title":"The Command Line Interface (CLI)","text":"While we are getting close to providing a standalone application, the most reliable way to use the app is still via the provided Docker container. In this container, the command line interface is accessible and can be used directly. For example via:","category":"page"},{"location":"cli/","page":"The Command Line Interface (CLI)","title":"The Command Line Interface (CLI)","text":"docker run -it --rm -v HOST_DIR:CONTAINER_DIR olivierlabayle/targeted-estimation:TAG tmle --help","category":"page"},{"location":"cli/","page":"The Command Line Interface (CLI)","title":"The Command Line Interface (CLI)","text":"where HOST_DIR:CONTAINER_DIR will map the host directory HOST_DIR to the container's CONTAINER_DIR and TAG is the currently released version of the project.","category":"page"},{"location":"cli/#Build-(requires-Julia)","page":"The Command Line Interface (CLI)","title":"Build (requires Julia)","text":"","category":"section"},{"location":"cli/","page":"The Command Line Interface (CLI)","title":"The Command Line Interface (CLI)","text":"Alternatively, provided you have Julia installed, you can build the app via:","category":"page"},{"location":"cli/","page":"The Command Line Interface (CLI)","title":"The Command Line Interface (CLI)","text":"julia --project deps/build_app.jl app","category":"page"},{"location":"cli/","page":"The Command Line Interface (CLI)","title":"The Command Line Interface (CLI)","text":"Bellow is a description of the functionalities offered by the CLI.","category":"page"},{"location":"cli/#CLI-Description","page":"The Command Line Interface (CLI)","title":"CLI Description","text":"","category":"section"},{"location":"cli/","page":"The Command Line Interface (CLI)","title":"The Command Line Interface (CLI)","text":"Pages = [\"tmle_estimation.md\", \"sieve_variance.md\", \"make_summary.md\"]\nDepth = 5","category":"page"},{"location":"make_summary/#Merging-TMLE-outputs","page":"Merging TMLE outputs","title":"Merging TMLE outputs","text":"","category":"section"},{"location":"make_summary/#Usage","page":"Merging TMLE outputs","title":"Usage","text":"","category":"section"},{"location":"make_summary/","page":"Merging TMLE outputs","title":"Merging TMLE outputs","text":"tmle make-summary --help","category":"page"},{"location":"make_summary/","page":"Merging TMLE outputs","title":"Merging TMLE outputs","text":"make_summary","category":"page"},{"location":"make_summary/#TargetedEstimation.make_summary","page":"Merging TMLE outputs","title":"TargetedEstimation.make_summary","text":"make_summary(\n    prefix; \n    outputs=Outputs(json=JSONOutput(filename=\"summary.json\"))\n)\n\nCombines multiple TMLE .hdf5 output files in a single file. Multiple formats can be output at once.\n\nArgs\n\nprefix: Prefix to .hdf5 files to be used to create the summary file\n\nOptions\n\n-o, --outputs: Ouptuts configuration.\n\n\n\n\n\n","category":"function"},{"location":"models/#Models","page":"Models","title":"Models","text":"","category":"section"},{"location":"models/","page":"Models","title":"Models","text":"CurrentModule = TargetedEstimation","category":"page"},{"location":"models/","page":"Models","title":"Models","text":"Because TMLE.jl is based on top of MLJ, we can support any model respecting the MLJ interface. At the moment, we readily support all models from the following packages:","category":"page"},{"location":"models/","page":"Models","title":"Models","text":"MLJLinearModels: Generalized Linear Models in Julia.\nXGBoost.jl: Julia wrapper of the famous XGBoost package.\nEvoTrees.jl: A pure Julia implementation of histogram based gradient boosting trees (subset of XGBoost)\nGLMNet: A Julia wrapper of the glmnet package. See the GLMNet section.\nMLJModels: General utilities such as the OneHotEncoder or InteractionTransformer.","category":"page"},{"location":"models/","page":"Models","title":"Models","text":"Further support for more packages can be added on request, please fill an issue.","category":"page"},{"location":"models/","page":"Models","title":"Models","text":"Also, because the estimator file used by the TMLE CLI is a pure Julia file, it is possible to use it in order to install additional package that can be used to define additional models.","category":"page"},{"location":"models/","page":"Models","title":"Models","text":"Finally, we also provide some additional models described in Additional models provided by TargetedEstimation.jl.","category":"page"},{"location":"models/#Additional-models-provided-by-TargetedEstimation.jl","page":"Models","title":"Additional models provided by TargetedEstimation.jl","text":"","category":"section"},{"location":"models/#GLMNet","page":"Models","title":"GLMNet","text":"","category":"section"},{"location":"models/","page":"Models","title":"Models","text":"This is a simple wrapper around the glmnetcv function from the GLMNet.jl package. The only difference is that the resampling is made based on MLJ resampling strategies.","category":"page"},{"location":"models/","page":"Models","title":"Models","text":"GLMNetRegressor(;resampling=CV(), params...)","category":"page"},{"location":"models/#TargetedEstimation.GLMNetRegressor-Tuple{}","page":"Models","title":"TargetedEstimation.GLMNetRegressor","text":"GLMNetRegressor(;resampling=CV(), params...)\n\nA GLMNet regressor for continuous outcomes based on the glmnetcv function from the GLMNet.jl  package.\n\nArguments:\n\nresampling: A MLJ ResamplingStrategy, see MLJ resampling strategies\nparams: Additional parameters to the glmnetcv function\n\nExamples:\n\nA glmnet with alpha=0.\n\n\nmodel = GLMNetRegressor(resampling=CV(nfolds=3), alpha=0)\nmach = machine(model, X, y)\nfit!(mach, verbosity=0)\n\n\n\n\n\n","category":"method"},{"location":"models/","page":"Models","title":"Models","text":"GLMNetClassifier(;resampling=StratifiedCV(), params...)","category":"page"},{"location":"models/#TargetedEstimation.GLMNetClassifier-Tuple{}","page":"Models","title":"TargetedEstimation.GLMNetClassifier","text":"GLMNetClassifier(;resampling=StratifiedCV(), params...)\n\nA GLMNet classifier for binary/multinomial outcomes based on the glmnetcv function from the GLMNet.jl  package.\n\nArguments:\n\nresampling: A MLJ ResamplingStrategy, see MLJ resampling strategies\nparams: Additional parameters to the glmnetcv function\n\nExamples:\n\nA glmnet with alpha=0.\n\n\nmodel = GLMNetClassifier(resampling=StratifiedCV(nfolds=3), alpha=0)\nmach = machine(model, X, y)\nfit!(mach, verbosity=0)\n\n\n\n\n\n","category":"method"},{"location":"models/#RestrictedInteractionTransformer","page":"Models","title":"RestrictedInteractionTransformer","text":"","category":"section"},{"location":"models/","page":"Models","title":"Models","text":"This transformer generates interaction terms based on a set of primary variables in order to limit the combinatorial explosion.","category":"page"},{"location":"models/","page":"Models","title":"Models","text":"RestrictedInteractionTransformer","category":"page"},{"location":"models/#TargetedEstimation.RestrictedInteractionTransformer","page":"Models","title":"TargetedEstimation.RestrictedInteractionTransformer","text":"RestrictedInteractionTransformer(;order=2, primary_variables=Symbol[], primary_variables_patterns=Regex[])\n\nDefinition\n\nThis transformer generates interaction terms based on a set of primary variables. All generated interaction terms  are composed of a set of primary variables and at most one remaining variable in the provided table. If (T₁, T₂) are defining the set of primary variables and (W₁, W₂) are reamining variables in the table, the generated interaction terms at order 2  will be:\n\nT₁xT₂\nT₁xW₂\nW₁xT₂\n\nbut W₁xW₂ will not be generated because it would contain 2 remaining variables.\n\nArguments:\n\norder: All interaction features up to the given order will be computed\nprimary_variables: A set of column names to generate the interactions\nprimaryvariablespatterns: A set of regular expression that can additionally \n\nbe used to identify primary_variables.\n\n\n\n\n\n","category":"type"},{"location":"models/#BiAllelicSNPEncoder","page":"Models","title":"BiAllelicSNPEncoder","text":"","category":"section"},{"location":"models/","page":"Models","title":"Models","text":"This transformer, mostly useful for genetic studies, converts bi-allelic single nucleotide polyphormism columns, encoded as Strings to a count of one of the two alleles.","category":"page"},{"location":"models/","page":"Models","title":"Models","text":"BiAllelicSNPEncoder","category":"page"},{"location":"models/#TargetedEstimation.BiAllelicSNPEncoder","page":"Models","title":"TargetedEstimation.BiAllelicSNPEncoder","text":"BiAllelicSNPEncoder(patterns=Symbol[])\n\nEncodes bi-allelic SNP columns, identified by the provided patterns Regex,  as a count of a reference allele determined dynamically (not necessarily the minor allele).\n\n\n\n\n\n","category":"type"},{"location":"sieve_variance/#Sieve-Variance-Plateau-Estimation","page":"Sieve Variance Plateau Estimation","title":"Sieve Variance Plateau Estimation","text":"","category":"section"},{"location":"sieve_variance/","page":"Sieve Variance Plateau Estimation","title":"Sieve Variance Plateau Estimation","text":"If the i.i.d. (independent and identically distributed) hypothesis is not satisfied, most of the traditional statistical inference theory falls apart. This is typically possible in population genetics where a study may contain related individuals. Here we leverage a non-parametric method called Sieve Variance Plateau (SVP) estimation. The hypothesis is that the dependence between individuals is sufficiently small, so that our targeted estimator will still be asymptotically unbiased, but its variance will be under estimated. In brief, the SVP estimator computes a variance estimate for a range of thresholds 𝜏, by considering individuals to be independent if their distance exceeds 𝜏. As the distance threshold 𝜏 increases, fewer individuals are assumed to be independent. The maximum of this curve is the most conservative estimate of the variance of the target parameter estimator and constitutes our SVP corrected variance estimator.","category":"page"},{"location":"sieve_variance/#svp_command","page":"Sieve Variance Plateau Estimation","title":"Usage","text":"","category":"section"},{"location":"sieve_variance/","page":"Sieve Variance Plateau Estimation","title":"Sieve Variance Plateau Estimation","text":"tmle sieve-variance-plateau --help","category":"page"},{"location":"sieve_variance/","page":"Sieve Variance Plateau Estimation","title":"Sieve Variance Plateau Estimation","text":"sieve_variance_plateau","category":"page"},{"location":"sieve_variance/#TargetedEstimation.sieve_variance_plateau","page":"Sieve Variance Plateau Estimation","title":"TargetedEstimation.sieve_variance_plateau","text":"sieve_variance_plateau(input_prefix;\n    out=\"svp.hdf5\",\n    grm_prefix=\"GRM\",\n    verbosity=0, \n    n_estimators=10, \n    max_tau=0.8,\n    estimator_key=\"TMLE\"\n)\n\nSieve Variance Plateau CLI.\n\nArgs\n\ninput-prefix: Input prefix to HDF5 files generated by the tmle CLI.\n\nOptions\n\n-o, --out: Output filename.\n-g, --grm-prefix: Prefix to the aggregated GRM.\n-v, --verbosity: Verbosity level.\n-n, --n_estimators: Number of variance estimators to build for each estimate. \n-m, --max_tau: Maximum distance between any two individuals.\n-e, --estimator-key: Estimator to use to proceed with sieve variance correction.\n\n\n\n\n\n","category":"function"},{"location":"resampling/#Resampling-Strategies","page":"Resampling Strategies","title":"Resampling Strategies","text":"","category":"section"},{"location":"resampling/","page":"Resampling Strategies","title":"Resampling Strategies","text":"CurrentModule = TargetedEstimation","category":"page"},{"location":"resampling/","page":"Resampling Strategies","title":"Resampling Strategies","text":"We also provide additional resampling strategies compliant with the MLJ.ResamplingStrategy interface.","category":"page"},{"location":"resampling/#AdaptiveResampling","page":"Resampling Strategies","title":"AdaptiveResampling","text":"","category":"section"},{"location":"resampling/","page":"Resampling Strategies","title":"Resampling Strategies","text":"The AdaptiveResampling strategies will determine the number of cross-validation folds adaptively based on the available data. This is inspired from the this paper on practical considerations for super learning.","category":"page"},{"location":"resampling/","page":"Resampling Strategies","title":"Resampling Strategies","text":"The AdaptiveCV will determine the number of folds adaptively and perform a classic cross-validation split:","category":"page"},{"location":"resampling/","page":"Resampling Strategies","title":"Resampling Strategies","text":"AdaptiveCV","category":"page"},{"location":"resampling/#TargetedEstimation.AdaptiveCV","page":"Resampling Strategies","title":"TargetedEstimation.AdaptiveCV","text":"AdaptiveCV(;shuffle=nothing, rng=nothing)\n\nA CV (see MLJBase.CV) resampling strategy where the number of folds is determined  data adaptively based on the rule of thum described here.\n\n\n\n\n\n","category":"type"},{"location":"resampling/","page":"Resampling Strategies","title":"Resampling Strategies","text":"The AdaptiveStratifiedCV will determine the number of folds adaptively and perform a stratified cross-validation split:","category":"page"},{"location":"resampling/","page":"Resampling Strategies","title":"Resampling Strategies","text":"AdaptiveStratifiedCV","category":"page"},{"location":"resampling/#TargetedEstimation.AdaptiveStratifiedCV","page":"Resampling Strategies","title":"TargetedEstimation.AdaptiveStratifiedCV","text":"AdaptiveStratifiedCV(;shuffle=nothing, rng=nothing)\n\nA StratifiedCV (see MLJBase.StratifiedCV) resampling strategy where the number of folds is determined  data adaptively based on the rule of thum described here.\n\n\n\n\n\n","category":"type"},{"location":"resampling/#JointStratifiedCV","page":"Resampling Strategies","title":"JointStratifiedCV","text":"","category":"section"},{"location":"resampling/","page":"Resampling Strategies","title":"Resampling Strategies","text":"Sometimes, the treatment variables (or some other features) are imbalanced and naively performing cross-validation or stratified cross-validation could result in the violation of the positivity hypothesis. To overcome this difficulty, the following JointStratifiedCV, performs a stratified cross-validation based on both features variables and the outcome variable.","category":"page"},{"location":"resampling/","page":"Resampling Strategies","title":"Resampling Strategies","text":"JointStratifiedCV","category":"page"},{"location":"resampling/#TargetedEstimation.JointStratifiedCV","page":"Resampling Strategies","title":"TargetedEstimation.JointStratifiedCV","text":"JointStratifiedCV(;patterns=nothing, resampling=StratifiedCV())\n\nApplies a stratified cross-validation strategy based on a variable constructed from X and y.  A composite variable is built from: \n\nx variables from X matching any of patterns and satisfying autotype(x) <: Union{Missing, Finite}. \n\nIf no pattern is provided, then only the second condition is considered.\n\ny if autotype(y) <: Union{Missing, Finite}\n\nThe resampling needs to be a stratification compliant resampling strategy, at the moment  one of StratifiedCV or AdaptiveStratifiedCV\n\n\n\n\n\n","category":"type"},{"location":"#TargetedEstimation.jl","page":"Home","title":"TargetedEstimation.jl","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"The goal of this package, is to provide a standalone executable to run large scale Targeted Minimum Loss-based Estimation (TMLE) on tabular datasets. To learn more about TMLE, please visit TMLE.jl, the companion package.","category":"page"},{"location":"","page":"Home","title":"Home","text":"Jump to The Command Line Interface (CLI)","category":"page"},{"location":"","page":"Home","title":"Home","text":"We also provide extensions to the MLJ universe that are particularly useful in statistical genetics (but not restricted to it):","category":"page"},{"location":"","page":"Home","title":"Home","text":"Additional Models\nAdditional Resampling Strategies","category":"page"},{"location":"tmle_estimation/#Targeted-Minimum-Loss-Based-Estimation","page":"Targeted Minimum Loss Based Estimation","title":"Targeted Minimum Loss Based Estimation","text":"","category":"section"},{"location":"tmle_estimation/","page":"Targeted Minimum Loss Based Estimation","title":"Targeted Minimum Loss Based Estimation","text":"This is the main script in this package, it provides a command line interface for the estimation of statistical parameters using targeted Learning.","category":"page"},{"location":"tmle_estimation/#Usage","page":"Targeted Minimum Loss Based Estimation","title":"Usage","text":"","category":"section"},{"location":"tmle_estimation/","page":"Targeted Minimum Loss Based Estimation","title":"Targeted Minimum Loss Based Estimation","text":"tmle tmle --help","category":"page"},{"location":"tmle_estimation/","page":"Targeted Minimum Loss Based Estimation","title":"Targeted Minimum Loss Based Estimation","text":"tmle","category":"page"},{"location":"tmle_estimation/#TargetedEstimation.tmle","page":"Targeted Minimum Loss Based Estimation","title":"TargetedEstimation.tmle","text":"tmle(dataset; \n    estimands=\"generateATEs\", \n    estimators=\"glmnet\"; \n    verbosity=0, \n    outputs=Outputs(),\n    chunksize=100,\n    rng=123,\n    cache_strategy=\"release-unusable\",\n    sort_estimands=false\n)\n\nTMLE CLI.\n\nArgs\n\ndataset: Data file (either .csv or .arrow)\n\nOptions\n\n--estimands: A string (\"generateATEs\") or a serialized TMLE.Configuration (accepted formats: .json | .yaml | .jls)\n--estimators: A julia file containing the estimators to use.\n-v, --verbosity: Verbosity level.\n-o, --outputs: Ouputs to be generated.\n--chunksize: Results are written in batches of size chunksize.\n-r, --rng: Random seed (Only used for estimands ordering at the moment).\n-c, --cache-strategy: Caching Strategy for the nuisance functions, any of (\"release-unusable\", \"no-cache\", \"max-size\").\n\nFlags\n\n-s, --sort_estimands: Sort estimands to minimize cache usage (A brute force approach will be used, resulting in exponentially long sorting time).\n\n\n\n\n\n","category":"function"},{"location":"tmle_estimation/#Note-on-TMLE-Outputs","page":"Targeted Minimum Loss Based Estimation","title":"Note on TMLE Outputs","text":"","category":"section"},{"location":"tmle_estimation/","page":"Targeted Minimum Loss Based Estimation","title":"Targeted Minimum Loss Based Estimation","text":"We can output results in three different formats: HDF5, JSON and JLS. By default no output is written, so you need to specify at least one. An output can be generated by specifying an output filename for it. For instance --outputs.json.filename=output.json will output a JSON file. Note that you can generate multiple formats at once, e.g. --outputs.json.filename=output.json --outputs.hdf5.filename=output.hdf5 will output both JSON and HDF5 result files. Another important output option is the pval_threshold. Each estimation result is accompanied by an influence curve vector and by default these vectors are erased before saving the results because they typically take up too much space and are not usually needed. In some occasions you might want to keep them and this can be achieved by specifiying the output's pval_threhsold. For instance --outputs.hdf5.pval_threshold=1. will keep all such vectors because all p-values lie in between 0 and 1.","category":"page"},{"location":"tmle_estimation/","page":"Targeted Minimum Loss Based Estimation","title":"Targeted Minimum Loss Based Estimation","text":"In order to run sieve variance plateau correction after a TMLE run you need to save the results in HDF5 format with influence curve vectors. Furthermore, you will need to save the sample-ids associated with each result. A complete option set for this could be: --outputs.hdf5.filename=output.hdf5 --outputs.hdf5.pval_threshold=0.05 --sample_ids=true. In this case, only those results with an individual p-value of less than 005 will keep track of their influence curves and be considered for sieve variance correction.","category":"page"},{"location":"tmle_estimation/#Runtime","page":"Targeted Minimum Loss Based Estimation","title":"Runtime","text":"","category":"section"},{"location":"tmle_estimation/","page":"Targeted Minimum Loss Based Estimation","title":"Targeted Minimum Loss Based Estimation","text":"Targeted Learning can quickly become computationally intensive compared to traditional parametric inference. Here, we illustrate typical runtimes using examples from population genetics. This is because population genetics is currently the main use case for this package, but it shouldn't be understood as the only scope. In fact, the two most prominent study designs in population genetics are perfect illustrations of the computational complexity associated with Targeted Learning.","category":"page"},{"location":"tmle_estimation/#Preliminary","page":"Targeted Minimum Loss Based Estimation","title":"Preliminary","text":"","category":"section"},{"location":"tmle_estimation/","page":"Targeted Minimum Loss Based Estimation","title":"Targeted Minimum Loss Based Estimation","text":"Remember that for each estimand of interest, Targeted Learning requires 3 main ingredients that drive computational complexity:","category":"page"},{"location":"tmle_estimation/","page":"Targeted Minimum Loss Based Estimation","title":"Targeted Minimum Loss Based Estimation","text":"An estimator for the propensity score: G(T, W) = P(T|W).\nAn estimator for the outcome's mean: Q(T, W) = E[Y|T, W].\nA targeting step towards the estimand of interest.","category":"page"},{"location":"tmle_estimation/","page":"Targeted Minimum Loss Based Estimation","title":"Targeted Minimum Loss Based Estimation","text":"While the targeting step has a fixed form, both G and Q require specification of learning algorithms that can range from simple generalized linear models to complex Super Learners. In general, one doesn't know how the data has been generated and the model space should be kept as large as possible in order to provide valid inference. This means we recommend the use Super Learning for both G and Q as it comes with asymptotic theoretical guarantees. However, Super Learning is an expensive procedure and, depending on the context, might become infeasible. Also, notice that while the targeting step is specific to a given estimand, G and Q are only specific to the variables occuring in the causal graph. This means that they can potentially be cleverly reused across the estimation of multiple estimands. Note that this clever reuse, is already baked into this package, and nothing needs to be done beside specifying the learning algorithms for G and Q. The goal of the subsequent sections is to provide some examples, guiding the choice of those learning algorithms.","category":"page"},{"location":"tmle_estimation/","page":"Targeted Minimum Loss Based Estimation","title":"Targeted Minimum Loss Based Estimation","text":"In what follows, Y is an outcome of interest, W a set of confounding variables and T a genetic variation. Genetic variations are usually represented as a pair of alleles corresponding to an individual's genotype. We will further restrict the scope to bi-allelic single nucleotide variations. This means that, at a given locus where the two alleles are A and C, an individual could have any of the following genotype: AA, AC, CC. Those will be our treatment values.","category":"page"},{"location":"tmle_estimation/","page":"Targeted Minimum Loss Based Estimation","title":"Targeted Minimum Loss Based Estimation","text":"For all the following experiments:","category":"page"},{"location":"tmle_estimation/","page":"Targeted Minimum Loss Based Estimation","title":"Targeted Minimum Loss Based Estimation","text":"The Julia script can be found at experiments/runtime.jl.\nThe various estimators used below are further described in theestimators-configs folder.","category":"page"},{"location":"tmle_estimation/#Multiple-treatment-contrasts","page":"Targeted Minimum Loss Based Estimation","title":"Multiple treatment contrasts","text":"","category":"section"},{"location":"tmle_estimation/","page":"Targeted Minimum Loss Based Estimation","title":"Targeted Minimum Loss Based Estimation","text":"In a classic randomized control trial, the treatment variable can only take one of two levels: treated or not treated. In out example however, any genetic variation takes its values from three different levels. As such, the treated and not treated levels need to be defined and any of the following contrasts can be of interest:","category":"page"},{"location":"tmle_estimation/","page":"Targeted Minimum Loss Based Estimation","title":"Targeted Minimum Loss Based Estimation","text":"AA -> AC\nAC -> CC\nAA -> CC","category":"page"},{"location":"tmle_estimation/","page":"Targeted Minimum Loss Based Estimation","title":"Targeted Minimum Loss Based Estimation","text":"For a given outcome and genetic variation, for each contrast, both G and Q are actually invariant. This shows a first level of reduction in computational complexity. Both G and Q need to be fitted only once across multiple treatment contrasts and only the targeting step needs to be carried out again.","category":"page"},{"location":"tmle_estimation/#The-PheWAS-study-design","page":"Targeted Minimum Loss Based Estimation","title":"The PheWAS study design","text":"","category":"section"},{"location":"tmle_estimation/","page":"Targeted Minimum Loss Based Estimation","title":"Targeted Minimum Loss Based Estimation","text":"In a PheWAS, one is interested in the effect of a genetic variation across many outcomes (typically around 1000). Because the treatment variable is always the same, the propensity score G can be reused across all parameters, which drastically reduces computational complexity.","category":"page"},{"location":"tmle_estimation/","page":"Targeted Minimum Loss Based Estimation","title":"Targeted Minimum Loss Based Estimation","text":"<div style=\"text-align:center\">\n<img src=\"assets/phewas.png\" alt=\"PheWAS\" style=\"width:400px;\"/>\n</div>","category":"page"},{"location":"tmle_estimation/","page":"Targeted Minimum Loss Based Estimation","title":"Targeted Minimum Loss Based Estimation","text":"With this setup in mind, the computational complexity is mostly driven by the specification of the learning algorithms for Q, which will have to be fitted for each outcome. For 10 outcomes, we estimate the 3 Average Treatment Effects corresponding to the 3 possible treatment contrasts defined in the previous section. There are thus two levels of reuse of G and Q in this study design. In the table below are presented some runtimes for various specifications of G and Q using a single cpu. The \"Unit runtime\" is the average runtime across all estimands and can roughly be extrapolated to bigger studies.","category":"page"},{"location":"tmle_estimation/","page":"Targeted Minimum Loss Based Estimation","title":"Targeted Minimum Loss Based Estimation","text":"Estimator Unit runtime (s) Extrapolated runtime to 1000 outcomes\nglm. 4.65 ≈ 1h20\nglmnet 7.19 ≈ 2h\nG-superlearning-Q-glmnet 50.05 ≈ 13h45\nsuperlearning 168.98 ≈ 46h","category":"page"},{"location":"tmle_estimation/","page":"Targeted Minimum Loss Based Estimation","title":"Targeted Minimum Loss Based Estimation","text":"Depending on the exact setup, this means one can probably afford to use Super Learning for at least the estimation of G (and potentially also for Q for a single PheWAS). This turns out to be a great news because TMLE is a double robust estimator. As a reminder, it means that only one of the estimators for G or Q needs to converge sufficiently fast to the ground truth to guarantee that our estimates will be asymptotically unbiased.","category":"page"},{"location":"tmle_estimation/","page":"Targeted Minimum Loss Based Estimation","title":"Targeted Minimum Loss Based Estimation","text":"Finally, note that those runtime estimates should be interpreted as worse cases, this is because:","category":"page"},{"location":"tmle_estimation/","page":"Targeted Minimum Loss Based Estimation","title":"Targeted Minimum Loss Based Estimation","text":"Only 1 cpu is used.\nMost modern high performance computing platform will allow further parallelization.\nIn the case where G only is a Super Learner, since the number of parameters is still relatively low in this example, it is possible that the time to fit G still dominates the runtime.\nRuntimes include precompilation which becomes negligible with the size of the study.","category":"page"},{"location":"tmle_estimation/#The-GWAS-study-design","page":"Targeted Minimum Loss Based Estimation","title":"The GWAS study design","text":"","category":"section"},{"location":"tmle_estimation/","page":"Targeted Minimum Loss Based Estimation","title":"Targeted Minimum Loss Based Estimation","text":"In a GWAS, the outcome variable is held fixed and we are interested in the effects of very many genetic variations on this outcome (typically 800 000 for a genotyping array). The propensity score cannot be reused across parameters resulting in a more expensive run.","category":"page"},{"location":"tmle_estimation/","page":"Targeted Minimum Loss Based Estimation","title":"Targeted Minimum Loss Based Estimation","text":"<div style=\"text-align:center\">\n<img src=\"assets/gwas.png\" alt=\"GWAS\" style=\"width:400px;\"/>\n</div>","category":"page"},{"location":"tmle_estimation/","page":"Targeted Minimum Loss Based Estimation","title":"Targeted Minimum Loss Based Estimation","text":"Again, we estimate the 3 Average Treatment Effects corresponding to the 3 possible treatment contrasts. However we now look at 3 different genetic variations and only one outcome. In the table below are presented some runtimes for various specifications of G and Q using a single cpu. The \"Unit runtime\" is the average runtime across all estimands and can roughly be extrapolated to bigger studies.","category":"page"},{"location":"tmle_estimation/","page":"Targeted Minimum Loss Based Estimation","title":"Targeted Minimum Loss Based Estimation","text":"Estimator file Continuous outcome unit runtime (s) Binary outcome unit runtime (s) Projected Time on HPC (200 folds //)\nglm 5.64 6.14 ≈ 6h30\nglmnet 17.46 22.24 ≈ 22h\nG-superlearning-Q-glmnet 430.54 438.67 ≈ 20 days\nsuperlearning 511.26 567.72 ≈ 24 days","category":"page"},{"location":"tmle_estimation/","page":"Targeted Minimum Loss Based Estimation","title":"Targeted Minimum Loss Based Estimation","text":"We can see that modern high performance computing platforms definitely enable this study design when using GLMs or GLMNets. It is unlikely however, that you will be able to use Super Learning for any of P(V|W) or E[Y|V, W] if you don't have privileged access to such platform. While the double robustness guarantees will generally not be satisfied, our estimate will still be targeted, which means that its bias will be reduced compared to classic inference using a parametric model.","category":"page"}]
}
