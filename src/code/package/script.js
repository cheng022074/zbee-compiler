const {
    apply
} = require('../../template'),
{
    writeTextFile
} = require('../../fs'),
{
    join
} = require('path'),
{
    format
} = require('../../script');

module.exports = (code , packager , template = 'code.package.to.script') =>{

    let application = packager.application,
        {
            target
        } = packager.config,
        path;

    if(target){

        path = join(application.PATH , target) ;

    }else{

        path = join(application.DIST_PATH , `${packager.name}.js`) ;
    }

    writeTextFile(path , format(apply(template , {
        code,
        defaultScope:application.DEFAULT_SCOPE
    }))) ;

    return path ;
}