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
        name,
        code,
        meta,
    } = sourceCode,
    {
        params,
        imports,
        scoped
    } = meta;

    return apply('code.package.script.class' , {
        fullName,
        code,
        name,
        imports:import_codes(meta.imports),
        values:value_codes(meta.values),
        extend:extend_code(meta.extend)
    }) ;
}