const {
    get
} = require('../config'),
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
    env
} = process,
doGeneratePackageJSON = require('../package/package'),
doGenerateCSS = require('../package/scss');

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

const Meta = require('../../lib/code/bin/meta');

const compile = require('./compile') ;

async function doPackage({
    classes,
    type = 'library',
    memory = false,
    version,
    to,
    prefixes,
    ...config
} , name){

    if(prefixes && !env['ZBEE-PARAM-INCREMENT']){

        const {
            env
        } = process,
        folders = Object.keys(prefixes) ;

        for(let folder of folders){

            env[`ZBEE-PARAM-${folder}-PREFIX`] = prefixes[folder] ;
        }

        env['ZBEE-PARAM-FORCE'] = true ;
    }

    let importAllNames = [] ;

    for(let name of classes){

        let compileNames = compile(name) ;

        for(let compileName of compileNames){

            importAllNames.push(compileName , ...Meta.getImportAllNames(compileName)) ;

        }
    }

    importAllNames = unique(importAllNames) ;

    let metas = {},
        scriptMetas = {},
        cssMetas = {};

    for(let name of importAllNames){

        let meta = Meta.get(name) ;

        if(meta){

            metas[name] = meta ;

            switch(Meta.getMetaType(name)){

                case 'script':
                    
                    scriptMetas[name] = meta ;

                    break ;

                case 'css':

                    cssMetas[name] = meta ;
            }
        }
    }

    let {
            dependencies = {},
            rootPath:packageRootPath = APPLICATION.getFolderPath('package'),
            ...result
        } = await require(`../package/${type}`)(scriptMetas , config , name , metas) ;

    if(memory === true){

        return result ;
    }

    let rootPath = join(packageRootPath , name),
        css = doGenerateCSS(cssMetas , rootPath);

    if(css){
        
        result['index.css'] = css;
    }

    result['package.json'] = doGeneratePackageJSON(name , metas , Object.keys(result) , version || APPLICATION.version) ;

    let paths = Object.keys(result);

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