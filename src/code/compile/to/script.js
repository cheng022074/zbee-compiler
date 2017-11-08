const {
    join
} = require('path'),
{
    writeTextFile
} = require('../../../fs'),
{
    format
} = require('../../../script');

module.exports = (codeStr , code) =>{

    let path = join(code.project.BIN_PATH , code.scope , `${code.name}.js`) ;

    writeTextFile(path , format(codeStr)) ;

    return path ;
}