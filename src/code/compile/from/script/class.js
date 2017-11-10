const {
    apply
} = require('../../../../template'),
function_params = require('../../../script/function/params'),
import_codes = require('../../../script/imports'),
config_codes = require('../../../script/configs'),
extend_code = require('../../../script/function/extend');

module.exports = sourceCode =>{

    let {
        shortName,
        code,
        meta,
    } = sourceCode,
    {
        imports,
        configs,
        extend
    } = meta;

    return apply('code.compile.script.class' , {
        shortName,
        code,
        imports:import_codes(imports),
        configs:config_codes(configs),
        extend:extend_code(extend)
    }) ;
}