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
    join
} = require('path'),
{
    simpleObject:isObject
} = require('../is'),
{
    unique
} = require('../array'),
{
    writeFileSync
} = require('fs'),
{
    assign
} = Object,
JSZip = require('jszip'),
{
    apply
} = require('../template');

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
    ...config
} , name = `package-${Date.now()}`){

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
        result = require(`../package/${type}`)(codes , config) ;

    if(memory === true){

        return result ;
    }

    let dependencies = {};

    for(let code of codes){

        let data = SourceCode.getProperty(code , 'data') ;

        if(data){

            assign(dependencies , SourceCode.getProperty(code , 'dependentModules')) ;
        }
    }

    result['package.json'] = apply('code.package.package' , {
        name,
        type,
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
    }).then(data => writeFileSync(path , data)) ;

    console.log('已生成' , path) ;

    if(to){

        for(let toPath of to){

            let path = join(APPLICATION.rootPath , '..' , toPath , 'modules') ;

            writeFileSync(path) ;

            console.log('已复制到' , path) ;
        }
    }
}