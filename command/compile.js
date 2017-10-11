const {
    defined:is_defined
} = require('../src/is'),
{
    join:path_join
} = require('path'),
{
    name2path,
    getFilePath,
    COMPILE_SOURCE_PATH,
    COMPILE_DIST_PATH,
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
    get:script_get,
    compile:script_compile,
    convert
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
} = require('../src/template');

module.exports = name =>{

    if(!is_defined(name)){

        console.error('未指定名称') ;

        return false;
    }

    let sourcePath = COMPILE_SOURCE_PATH,
        path = getFilePath(path_join(sourcePath , name2path(name)) , config_get('suffix'));

    if(path){

        let config = config_get('suffix' , extname(path)) ;

        if(config){

            let result = apply(object_get(config , 'template.file') , script_get(config.data)(readTextFile(path) , path)) ;

            if(result){

                let suffix = config.suffix,
                    filePath = replaceSuffix(path , config.suffix).replace(sourcePath , COMPILE_DIST_PATH) ;

                switch(suffix){

                    case '.js':

                        result = `${template_get('generate.file.script.require').template}${script_compile(result).code}` ;
                }

                writeTextFile(filePath , result) ;
            }
        }

        return true ;
    }

    console.error(name , '不是一个有效的代码文件') ;
}