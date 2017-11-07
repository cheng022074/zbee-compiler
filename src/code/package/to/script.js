const {
    apply
} = require('../../../template'),
{
    writeTextFile
} = require('../../../fs'),
{
    join
} = require('path'),
{
    format
} = require('../../../script');

module.exports = (code , packager) =>{

    let application = packager.application ;

    let path = join(application.DIST_PATH , `${packager.name}.js`) ;

    writeTextFile(path , format(apply('code.package.to.script' , {
        code,
        defaultScope:application.DEFAULT_SCOPE
    }))) ;

    return path ;
}