const {
    join
} = require('path'),
{
    writeTextFile
} = require('../../fs');

module.exports = (codeStr , code) =>{

    let path = join(code.project.BIN_PATH , code.scope , `${code.name}.js`) ;

    writeTextFile(path , codeStr) ;

    return path ;
}