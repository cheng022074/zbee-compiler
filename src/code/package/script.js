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
} = require('../../script'),
{
    from
} = require('../../array');

module.exports = (code , packager , {
    template = 'code.package.to.script',
    name,
    isCompile = false
} = {}) =>{

    let application = packager.application,
        {
            target,
        } = packager.config,
        paths = [];

    if(target){

        let targetPaths  = from(target),
            {
                PATH
            } = application;

        for(let targetPath of targetPaths){

            paths.push(join(PATH , targetPath)) ;
        }

    }else{

        paths = [
            join(application.DIST_PATH , `${packager.name}.js`)
        ] ;
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

    for(let path of paths){

        writeTextFile(path , data) ;
        
    }

    return paths ;
}