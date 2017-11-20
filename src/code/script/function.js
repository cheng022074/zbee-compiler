const compile_script = require('../script'),
      param_codes = require('../script/function/params');

module.exports = (sourceCode , used) =>{

    let {
            scoped,
            params,
            async
        } = sourceCode.meta,
        template;

    if(scoped){
        
        template = `code.${used}.script.function.scope` ;
    
    }else{

        template = `code.${used}.script.function` ;
    }

    return compile_script(sourceCode , template , {
        async,
        params:param_codes(params)
    }) ;
}