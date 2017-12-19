const compile_script = require('../script');

module.exports = (sourceCode , used) =>{

    return compile_script(sourceCode , `code.${used}.script.module`) ;
}