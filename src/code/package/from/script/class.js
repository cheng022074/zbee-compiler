const {
    apply
} = require('../../../../template'),
function_params = require('../../../script/function/params'),
import_codes = require('../../../script/imports'),
value_codes = require('../../../script/values'),
extend_code = require('../../../script/function/extend');

module.exports = sourceCode =>{

    let {
        fullName,
        shortName,
        code,
        meta,
    } = sourceCode,
    {
        imports,
        configs,
        extend
    } = meta;

    return apply('code.package.script.class' , {
        fullName,
        code,
        shortName,
        imports:import_codes(imports),
        configs:value_codes(configs),
        extend:extend_code(extend)
    }) ;
}