const compile_script = require('../script');

module.exports = sourceCode =>{

    let {
        shortName
    } = sourceCode.meta;

    return compile_script(sourceCode , 'code.compile.script.class' , {
        shortName
    }) ;
}