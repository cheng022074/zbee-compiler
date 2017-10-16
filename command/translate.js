const {
    defined:is_defined
} = require('../src/is'),
{
    join:path_join,
    dirname,
    basename
} = require('path'),
{
    name2path,
    getFilePath,
    COMPILE_SOURCE_PATH,
    COMPILE_DIST_PATH,
    extname,
    replaceSuffix,
    getApplicationPath
} = require('../src/path'),
{
    get:config_get
} = require('../src/config'),
{
    get:object_get
} = require('../src/object'),
{
    get:script_get,
    compile:script_compile,
    convert,
    format:script_format
} = require('../src/script'),
{
    readTextFile,
    writeTextFile
} = require('../src/fs'),
{
    apply
} = require('../src/template'),
{
    get:properties_get
} = require('../src/properties'),
{
    get:template_get
} = require('../src/template'),
{
    parse:name_parse
} = require('../src/script/name');

module.exports = name =>{

    if(!is_defined(name)){
        
        console.error('未指定名称') ;

        return false;
    }

    let config = name_parse(name) ;

    if(config === false){

        return false ;
    }

    let {
        scope,
        name:className
    } = config,
        sourcePath ;

    if(scope){

        sourcePath = getApplicationPath(scope) ;
    
    }else{

        sourcePath = COMPILE_SOURCE_PATH ;
    }

    let path = getFilePath(path_join(sourcePath , name2path(className)) , config_get('suffix'));

    if(path){

        let config = config_get('suffix' , extname(path)) ;

        if(config){

            let result = apply(object_get(config , 'template.source') , script_get(config.data)(readTextFile(path) , path)) ;

            if(result){

                let suffix = object_get(config , 'suffix.source') ;

                if(!suffix){

                    return false ;
                }

                let filePath = replaceSuffix(path , suffix) ;

                writeTextFile(filePath , script_format(result)) ;
            }
        }

        return true ;
    }

    console.error(name , '不是一个有效的代码文件') ;
}