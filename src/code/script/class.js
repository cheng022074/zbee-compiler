const compile_script = require('../script');

module.exports = sourceCode =>{

    let {
        shortName
    } = sourceCode;

    return compile_script(sourceCode , 'code.compile.script.class' , {
        shortName
    }) ;
}