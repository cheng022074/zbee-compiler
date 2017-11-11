const compile_script = require('../script'),
      param_codes = require('../../../script/function/params');

module.exports = (sourceCode) =>{

    let {
            scoped,
            params
        } = sourceCode.meta,
        template;

    if(scoped){
        
        template = 'code.compile.script.function.scope' ;
    
    }else{

        template = 'code.compile.script.function' ;
    }

    params = param_codes(params) ;

    return compile_script(sourceCode , template , {
        params
    }) ;
}