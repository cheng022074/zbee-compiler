const {
    apply
} = require('../../../../template'),
function_params = require('../../../script/function/params'),
import_codes = require('../../../script/imports'),
value_codes = require('../../../script/values');

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

        templateName = 'code.compile.script.function.scope' ;
    
    }else{

        templateName = 'code.compile.script.function' ;
    }

    return apply(templateName , {
        fullName,
        code,
        params:function_params(meta.params),
        imports:import_codes(meta.imports),
        values:value_codes(meta.values)
    }) ;
}