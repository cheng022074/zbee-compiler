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
    format,
    compile
} = require('../../script');

module.exports = (code , packager , {
    template = 'code.package.to.script',
    name,
    isCompile = false
} = {}) =>{

    let application = packager.application,
        {
            target,
        } = packager.config,
        path;

    if(target){

        path = join(application.PATH , target) ;

    }else{

        path = join(application.DIST_PATH , `${packager.name}.js`) ;
    }

    let data = apply(template , {
        name:name || packager.name,
        code,
        defaultScope:application.DEFAULT_SCOPE
    }) ;

    if(isCompile){

        data = compile(data) ;

    }else{

        data = format(data) ;
    }

    writeTextFile(path , data) ;

    return path ;
}