const compile_script = require('../../script'),
      param_codes = require('../../../../script/function/params/object');

module.exports = (sourceCode) =>{

    let {
        params
    } = sourceCode.meta;

    params = param_codes(params) ;

    return compile_script(sourceCode , 'code.compile.script.function.test' , {
        params
    }) ;
}