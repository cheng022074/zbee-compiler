const {
    apply
} = require('../../../../../template'),
function_params = require('../../../../script/function/params/object'),
import_codes = require('../../../../script/imports');

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

    return apply('code.compile.script.function' , {
        fullName,
        code,
        params:function_params(meta.params),
        imports:import_codes(meta.imports)
    }) ;
}