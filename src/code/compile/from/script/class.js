const {
    apply
} = require('../../../../template'),
function_params = require('../../../script/function/params'),
import_codes = require('../../../script/imports'),
value_codes = require('../../../script/values'),
extend_code = require('../../../script/function/extend');

module.exports = sourceCode =>{

    let {
        shortName,
        code,
        meta,
    } = sourceCode,
    {
        params,
        imports,
        scoped
    } = meta,
    templateName;

    return apply('code.compile.script.class' , {
        shortName,
        code,
        imports:import_codes(meta.imports),
        values:value_codes(meta.values),
        extend:extend_code(meta.extend)
    }) ;
}