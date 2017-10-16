const {
    get:properties_get
} = require('../src/properties'),
{
    extname:path_extname,
    join:path_join
} = require('path'),
{
    name2path,
    getFilePaths,
    extname,
    getApplicationPath
} = require('../src/path'),
{
    from:array_from,
    unique:array_unique
} = require('../src/array'),
{
    importPaths,
    get:script_get,
    compile:script_compile
} = require('../src/script'),
{
    get:config_get
} = require('../src/config'),
{
    get:object_get
} = require('../src/object'),
{
    template_apply,
    get:template_get
} = require('../src/template'),
{
    readTextFile,
    writeTextFile
} = require('../src/fs'),
{
    parse:name_parse
} = require('../src/script/name');

module.exports = (name = 'default') =>{


    let config = properties_get(`package.${name}`) ;

    if(config){

        let importNames = array_from(config.imports),
            scriptPaths = [];

        for(let importName of importNames){

            let config = name_parse(importName) ;

            if(config === false){

                continue ;
            }

            let paths = getFilePaths(path_join(getApplicationPath(config.scope) , name2path(config.name)) , config_get('suffix')) ;

            for(let path of paths){

                scriptPaths.push(...importPaths(path)) ;

                scriptPaths.push(path) ;
            }
        }

        scriptPaths = array_unique(scriptPaths) ;

        let codes = [] ;

        for(let scriptPath of scriptPaths){

            let config = config_get('suffix' , extname(scriptPath)),
                templateName = object_get(config , 'template.package');

            if(templateName){

                let sourceCode ;

                switch(path_extname(scriptPath)){

                    case '.js':

                        sourceCode = script_compile(readTextFile(scriptPath)).code ;

                        break ;

                    case '.xml':

                        sourceCode = readTextFile(scriptPath) ;
                }

                let code = template_apply(templateName , script_get(config.data)(sourceCode , scriptPath)) ;

                if(code){

                    codes.push(code) ;
                }
            }
        }

        let {
            template,
            dist
        } = config ;

        if(template && dist){

            writeTextFile(getApplicationPath(dist) , apply(template , {
                body:codes.join('\n')
            })) ;

        }else{

            console.error(name , '缺少必要打包设置') ;
        }

    }else{

        console.error(name , '不是一个有效的打包配置') ;
    }
}