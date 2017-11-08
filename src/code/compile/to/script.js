const {
    join
} = require('path'),
{
    writeTextFile
} = require('../../../fs'),
{
    format
} = require('../../../script'),
{
    apply
} = require('../../../template');

module.exports = (codeStr , code) =>{

    let application = code.project,
        path = join(application.BIN_PATH , code.scope , `${code.name}.js`) ;

    writeTextFile(path , format(apply('code.compile.to.script' , {
        code:codeStr,
        defaultScope:application.DEFAULT_SCOPE
    }))) ;

    return path ;
}