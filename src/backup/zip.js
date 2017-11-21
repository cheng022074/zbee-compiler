const {
    zip
} = require('../zip'),
application = require('../application'),
{
    join,
    extname
} = require('path'),
{
    from
} = require('../array'),
{
    file:is_file,
    directory:is_directory
} = require('../is'),
suffixRe = /\.[^\.]+$/;

module.exports = (name , {
    includes,
    timestamp,
    target
}) =>{

    let PATH = application.PATH,
        path;

    if(target){
        
        path = join(PATH , target) ;

    }else{

        path = join(application.BACKUP_PATH , `${name}.zip`) ;
    }

    if(timestamp){

        path = join(path.replace(suffixRe , '') , `${Date.now()}${extname(path)}`) ;
    }

    let files = [],
        directories = [];

    let paths = from(includes) ;

    for(let path of paths){

        let targetPath = join(PATH , path) ;

        if(is_file(targetPath)){

            files.push({
                path:targetPath,
                name:path
            }) ;

        }else if(is_directory(targetPath)){

            directories.push({
                path:targetPath,
                name:path
            }) ;
        }
    }

    zip({
        files,
        directories
    } , path) ;

    return path ;
}