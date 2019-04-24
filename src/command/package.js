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
    writeFile,
    writeJSONFile
} = require('../fs'),
{
    assign
} = Object,
JSZip = require('jszip'),
{
    apply
} = require('../template'),
{
    date:convertDate
} = require('../string/convert'),
{
    env
} = process;

module.exports = name =>{

    if(!name){

        const 
        config = get('package'),
        names = Object.keys(config);

        for(let name of names){

            doPackageFromConfig(config[name] , name) ;
        }
    
    }else if(isObject(name)){

        let {
            name,
            ...config
        } = name ;

        return doPackage(config , name) ;

    }else{

        let config = get('package' , name) ;

        if(config){

            doPackageFromConfig(config , name) ;
        
        }else{

            console.log('无效打包配置' , name) ;
        }
    }

}

function doPackageFromConfig(config , name){

    doPackage({
        ...config,
        memory:false
    } , name) ;
}

function doPackage({
    classes,
    type = 'library',
    memory = false,
    to,
    archive = true,
    ...config
} , name = `package-${Date.now()}`){

    if(memory === true){

        archive = false ;
    }

    let allCodes = [] ;

    for(let name of classes){

        let codes = SourceCode.getMany(name) ;

        for(let code of codes){

            let {
                importAllSourceCodes
            } = code ;

            allCodes.push(...importAllSourceCodes , code) ;
        }
    }

    let codes = unique(allCodes),
        {
            dependencies = {},
            ...result
        } = require(`../package/${type}`)(codes , config) ;

    if(memory === true){

        return result ;
    }

    for(let code of codes){

        let data = SourceCode.getProperty(code , 'data') ;

        if(data){

            assign(dependencies , SourceCode.getProperty(code , 'dependentModules')) ;
        }
    }

    let currentDependencies = APPLICATION.getDependentModules(),
        keys = Object.keys(dependencies);

    for(let key of keys){

        if(currentDependencies.hasOwnProperty(key)){

            dependencies[key] = currentDependencies[key] ;
        }
    }

    result['package.json'] = apply('code.package.package' , {
        name,
        module:type === 'library',
        version:APPLICATION.version,
        dependencies
    }) ;

    let paths = Object.keys(result) ;

    let zip = new JSZip() ;

    for(let path of paths){

        zip.file(path , result[path]) ;
    }

    let path = join(APPLICATION.getFolderPath('package') , `${name}.zip`) ;

    zip.generateAsync({
        type:'nodebuffer'
    }).then(data => {

        writeFile(path , data) ;

        console.log('已生成' , path) ;

        if(archive){

            let rootPath = join(APPLICATION.getFolderPath('archive') , convertDate(new Date() , {
                format:'YYYYMMDD'
            })),
            zipPath = join(rootPath , `${name}.zip`);

            writeFile(zipPath , data) ;

            writeJSONFile(join(rootPath , `xy.package.json`) , {
                classes,
                type,
                memory,
                ...config
            }) ;

            console.log('已存档' , zipPath) ;

            
        }

        if(env['ZBEE-PARAM-IGNORE-OUTPUT']){

            return ;
        }
        
        if(to){

            for(let toPath of to){
    
                if(isAbsolute(toPath)){

                    if(isDirectory(toPath)){

                        {
                            let toZipPath = join(toPath , 'zbee_modules' , `${name}.zip`) ;
            
                            writeFile(toZipPath , data) ;
            
                            console.log('已复制' , toZipPath) ;
                        }
    
                        {
                            let keys = Object.keys(result) ;
    
                            for(let key of keys){
    
                                let toFilePath = join(toPath , 'node_modules' , name , key) ;
    
                                writeFile(toFilePath , result[key]) ;
    
                                console.log('已复制' , toFilePath) ;
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

    }) ;
}