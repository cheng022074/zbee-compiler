const {
    SourceCode
} = require('../code'),
{
    writeTextFile,
    writeJSONFile,
    copy
} = require('../fs'),
{
    apply
} = require('../template'),
{
    compile,
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
    join,
    isAbsolute,
    dirname
} = require('path'),
{
    unique
} = require('../array'),
{
    normalize
} = require('../name'),
{
    simpleObject:isObject,
    directory:is_directory
} = require('../is');

function doPackage(name){

    if(!name){

        const names = Object.keys(get('package')) ;

        for(let name of names){

            doPackage(name) ;
        }

        return ;
    }

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
        name:baseName,
        compress,
        bootstrap,
        config:baseConfig,
        targets,
        browser,
        ignores,
        resources,
        es6
    } = config,
    codes = [];

    if(baseName){

        name = baseName ;
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

    let {
        libraries,
        dependentModules
    } = APPLICATION ;

    libraries.ignoreIndexes = ignores ;

    let {
        codeMap,
        aliasMap
    } = libraries;

    delete libraries.ignoreIndexes ;

    const {
        defaultFolder
    } = APPLICATION;

    let path = join(APPLICATION.getFolderPath('package') , name),
        packageConfig = {
            codeMap:{
                ...codeMap,
                ...createCodeMap(codes)
            },
            aliasMap:{
                ...aliasMap,
                ...createAliasMap(codes)
            },
            bootstrap,
            browser,
            es6,
            config:baseConfig || {},
            defaultFolder
        } ;

    {
        let outPath =  join(path , 'lib.js') ;

        writeTextFile(outPath , apply('code.package.lib' , packageConfig)) ;

        console.log('已完成' , outPath) ;
    }

    {
        let outPath = join(path , 'meta.xml') ;

        writeTextFile(outPath , apply('code.package.meta' , packageConfig)) ;

        console.log('已完成' , outPath) ;
    }

    {
        let outPath = join(path , 'package.json') ;

        writeJSONFile(outPath , {
            name,
            dependencies:dependentModules
        }) ;

        console.log('已完成' , outPath) ;
    }

    {
        let outPath = join(path , 'index.js'),
            data = apply('code.package.index' , packageConfig),
            indexData = '';

        if(compress){

            indexData = min(data) ;
        
        }else{
    
            indexData = format(data) ;
        }
        
        writeTextFile(outPath , indexData) ;

        console.log('已完成' , outPath) ;

        let folderPath = dirname(outPath);

        if(resources){

            let rootPath = process.env['ZBEE-APPLICATION-ROOT-PATH'];

            for(let resource of resources){

                let path = join(rootPath , resource);

                copy(path , folderPath) ;

                console.log('已同步到' , path) ;
            }
        }
    }

    if(targets){

        for(let target of targets){

            if(isAbsolute(target) && is_directory(target)){

                copy(path , target) ;

                console.log('已复制到' , target) ;
            }
        }
    }

    console.log('已打包' , path) ;
}

function createCodeMap(codes){

    let map = {} ;

    for(let code of codes){

        map[code.fullName] = code.target.packageCodeText ;
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

            for(let alias of aliases){

                map[alias] =  fullName;
            }
        }
    }

    return map ;
}

module.exports = doPackage ;