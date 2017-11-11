const get_function;

module.exports = sourceCode =>{

    let {
        fullName,
        code,
        meta,
    } = sourceCode,
    {
        scoped,
        params,
        imports,
        configs,
        extend,
        requires,
    } = meta,
    templateName;

    if(scoped){

        templateName = 'code.compile.script.function.scope' ;
    
    }else{

        templateName = 'code.compile.script.function' ;
    }

    return apply(templateName , {
        fullName,
        code,
        params:function_params(params),
        imports:import_codes(imports),
        requires:require_codes(requires),
        configs:config_codes(configs),
        extend:extend_code(extend)
    }) ;
}