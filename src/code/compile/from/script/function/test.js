const {
    apply
} = require('../../../../../template'),
function_params = require('../../../../script/function/params/object'),
import_codes = require('../../../../script/imports'),
value_codes = require('../../../../script/values'),
extend_code = require('../../../../script/function/extend');

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

    return apply('code.compile.script.function.test' , {
        fullName,
        code,
        params:function_params(meta.params),
        imports:import_codes(meta.imports),
        values:value_codes(meta.values),
        extend:extend_code(meta.extend)
    }) ;
}