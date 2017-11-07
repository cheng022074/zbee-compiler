const {
    apply
} = require('../../../template'),
function_params = require('./function/params');

module.exports = sourceCode =>{

    let {
        fullName,
        code,
        meta
    } = sourceCode ;

    return apply('code.package.script.function' , {
        fullName,
        code,
        params:function_params(meta.params)
    }) ;
}