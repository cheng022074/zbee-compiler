const {
    defined:is_defined
} = require('../src/is'),
{
    join:path_join
} = require('path'),
{
    name2path,
    getFilePaths,
    extname,
    replaceSuffix
} = require('../src/path'),
{
    get:config_get
} = require('../src/config'),
{
    get:object_get
} = require('../src/object'),
{
    get:script_get
} = require('../src/script'),
{
    readTextFile,
    writeTextFile
} = require('../src/fs'),
{
    apply
} = require('../src/template');

module.exports = (name , compilePath) =>{

    if(!is_defined(name)){

        console.error('未指定类名称') ;

        return false;
    }

    if(is_defined(compilePath)){

        compilePath = path_join(process.cwd() , compilePath) ;

    }else{

        compilePath = process.cwd() ;
    }

    let bootPath = process.cwd(),
        path = path_join(bootPath , name2path(name)),
        paths = getFilePaths(path);

    for(let path of paths){

        let suffix = extname(path),
            config = config_get('suffix' , suffix) ;

        if(config){

            let result = apply(object_get(config , 'template.file') , script_get(config.data)(readTextFile(path))) ;

            if(result){

                let filePath = replaceSuffix(path , config.suffix).replace(bootPath , compilePath) ;

                writeTextFile(filePath , result) ;

                console.log('已编译' , filePath) ;
            }
        }
    }

    return true ;
}