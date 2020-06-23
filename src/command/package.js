const {
    get
} = require('../config'),
{
    SourceCode
} = require('../code'),
{
    APPLICATION
} = require('../project'),
{
    join,
    isAbsolute,
    extname
} = require('path'),
{
    simpleObject:isObject,
    directory:isDirectory,
    file:isFile
} = require('../is'),
{
    unique
} = require('../array'),
{
    writeFile
} = require('../fs'),
{
    assign
} = Object,
{
    apply
} = require('../template'),
{
    env
} = process;

module.exports = async name =>{

    if(!name){

        const 
        config = get('package'),
        names = Object.keys(config);

        for(let name of names){

            await doPackageFromConfig(config[name] , name) ;
        }
    
    }else if(isObject(name)){

        let {
            name:baseName,
            ...config
        } = name ;

        return await doPackage(config , baseName) ;

    }else{

        let config = get('package' , name) ;

        if(config){

            await doPackageFromConfig(config , name) ;
        
        }else{

            console.log('无效打包配置' , name) ;
        }
    }

}

async function doPackageFromConfig(config , name){

    await doPackage({
        ...config,
        memory:false
    } , name) ;
}

function getPackageName(name){

    return name.replace(/\-/g , '_').toLowerCase() ;
}

const
Meta = require('../../lib/code/bin/meta'),
getFullName = require('../../lib/code/source/name/full');

const compile = require('./compile') ;

async function doPackage({
    classes,
    type = 'library',
    memory = false,
    version,
    to,
    ...config
} , name){

    let importAllNames = [] ;

    for(let name of classes){

        let compileNames = compile(name) ;

        if(compileNames.length){

            for(let compileName of compileNames){

                importAllNames.push(compileName , ...Meta.getImportAllNames(compileName)) ;
    
            }
        
        }else{

            name = getFullName(name) ;

            importAllNames.push(name , ...Meta.getImportAllNames(name)) ;
        }
    }

    importAllNames = unique(importAllNames) ;

    let metas = {} ;

    for(let name of importAllNames){

        let meta = Meta.get(name) ;

        if(meta){

            metas[name] = meta ;
        }
    }

    let {
            dependencies = {},
            rootPath:packageRootPath = APPLICATION.getFolderPath('package'),
            ...result
        } = await require(`../package/${type}`)(metas , config , name) ;

    if(memory === true){

        return result ;
    }

    for(let name of importAllNames){

        assign(dependencies , metas[name].dependentModules) ;
        
    }

    let files = Object.keys(result) ;

    result['package.json'] = apply('code.package.package' , {
        name:getPackageName(name),
        files,
        version:version || APPLICATION.version,
        dependencies
    }) ;

    let paths = Object.keys(result),
        rootPath = join(packageRootPath , name);

    for(let path of paths){

        let data = result[path] ;

        path = join(rootPath , path) ;

        writeFile(path , data) ;

        console.log('已生成' , path) ;
    }

    if(env['ZBEE-PARAM-IGNORE-OUTPUT']){

        return ;
    }
        
    if(to){

        for(let toPath of to){

            if(isAbsolute(toPath)){

                if(isDirectory(toPath)){

                    {

                        if(isDirectory(join(toPath , 'node_modules'))){

                            let rootPath = join(toPath , 'node_modules' , 'zbee-sdk/package' , name) ;

                            for(let path of paths){
    
                                let toFilePath = join(rootPath , path) ;
    
                                writeFile(toFilePath , result[path]) ;
    
                                console.log('已复制' , toFilePath) ;
                            } 
                        
                        }else{

                            for(let path of paths){
    
                                let toFilePath = join(toPath , path) ;
    
                                writeFile(toFilePath , result[path]) ;
    
                                console.log('已复制' , toFilePath) ;
                            } 
                        }
                    }

                }else if(isFile(toPath)){

                    let data = result[`index${extname(toPath)}`] ;

                    if(data){

                        writeFile(toPath , data) ;

                        console.log('已重写' , toPath) ;
                    }
                }
            }
        }
    }
}