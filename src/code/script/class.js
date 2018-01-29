const compile_script = require('../script');

module.exports = (sourceCode , used) =>{

    let {
        shortName
    } = sourceCode;

    return compile_script(sourceCode , `code.${used}.script.class` , {
        shortName
    }) ;
}