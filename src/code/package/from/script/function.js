const {
    apply
} = require('../../../../template'),
function_params = require('../../../script/function/params'),
import_codes = require('../../../script/imports'),
config_codes = require('../../../script/configs'),
extend_code = require('../../../script/function/extend');

module.exports = sourceCode =>{

    let {
        fullName,
        code,
        meta,
    } = sourceCode,
    {
        params,
        imports,
        configs,
        extend
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
        params:function_params(params),
        imports:import_codes(imports),
        configs:value_codes(configs),
        extend:extend_code(extend)
    }) ;
}