const {
    SourceCode
} = require('../code'),
{
    readTextFile,
    writeTextFile
} = require('../fs'),
{
    apply
} = require('../template'),
{
    format,
    min
} = require('../script'),
{
    get
} = require('../config'),
{
    APPLICATION
} = require('../project'),
{
    join
} = require('path'),
{
    unique
} = require('../array'),
{
    normalize
} = require('../name'),
{
    simpleObject:isObject
} = require('../is');

module.exports = (name = 'default') =>{

    let config ;

    if(isObject(name)){

        config = name ;

    }else{

        config = get('package' , name) ;
    }

    if(!config){

        console.log('未找到打包配置' , name) ;

        return ;
    }

    let {
        classes:names,
        name:fileName,
        compress,
        bootstrap,
        config:baseConfig
    } = config,
    codes = [];

    if(!fileName){

        fileName = name ;
    }
    
    for(let name of names){

        let code = SourceCode.get(name) ;

        if(code.exists){

            let {
                importAllSourceCodes
            } = code ;
    
            for(let code of importAllSourceCodes){

                if(code.exists){

                    codes.push(code) ;
                }
            }

            codes.push(code) ;
        }
    }

    codes = unique(codes) ;

    let libraries = [],
        paths = APPLICATION.libraries.paths;

    for(let path of paths){

        libraries.push(readTextFile(path));

    }

    let {
            defaultFolder
        } = APPLICATION;

    let path = join(APPLICATION.getFolderPath('package') , `${fileName}.js`),
        data = apply('code.package' , {
            codeMap:createCodeMap(codes),
            aliasMap:createAliasMap(codes),
            bootstrap,
            config:baseConfig,
            defaultFolder
        });

    if(compress){

        data = min(data) ;
    
    }else{

        data = format(data) ;
    }    

    writeTextFile(path , data) ;

    console.log('已打包' , path) ;
}

function createCodeMap(codes){

    let map = {} ;

    for(let code of codes){

        map[code.fullName] = code.packageCodeText ;
    }

    return map ;
}

function createAliasMap(codes){

    let map = {} ;

    for(let {
        target,
        fullName
    } of codes){

        let {
            aliases
        } = target ;

        if(aliases){

            for(let {
                folder,
                name
            } of aliases){

                map[normalize(name , folder)] =  fullName;
            }
        }
    }

    return map ;
}