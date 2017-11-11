const get_script_data = require('../../script');

module.exports = sourceCode =>{

    return {
        template:'code.compile.script.function.test',
        ...get_script_data(sourceCode)
    } ;
}