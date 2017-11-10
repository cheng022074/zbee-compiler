const {
    join
} = require('path'),
{
    writeTextFile
} = require('../../../../fs'),
{
    format
} = require('../../../../script'),
{
    apply
} = require('../../../../template'),
library_codes = require('../../../script/libraries');

module.exports = (codeStr , code) =>{

    let application = code.project,
        path = join(application.BIN_PATH , code.scope , `${code.name}.js`) ;

    writeTextFile(path , format(apply('code.compile.to.script.application' , {
        code:codeStr,
        defaultScope:application.DEFAULT_SCOPE,
        libraries:library_codes(application.LIBRARY_PATHS)
    }))) ;

    return path ;
}