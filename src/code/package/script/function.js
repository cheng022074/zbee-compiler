const {
    apply
} = require('../../../template'),
function_params = require('../../script/function/params'),
import_codes = require('../../script/imports');

module.exports = sourceCode =>{

    let {
        fullName,
        code,
        meta,
    } = sourceCode,
    {
        params,
        imports,
        scoped
    } = meta,
    templateName;

    if(scoped){

        templateName = 'code.package.script.function.scope' ;
    
    }else{

        templateName = 'code.package.script.function' ;
    }

    return apply(templateName , {
        fullName,
        code,
        params:function_params(meta.params),
        imports:import_codes(meta.imports)
    }) ;
}