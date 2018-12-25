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
    writeTextFile
} = require('../fs');

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
    ...config
} , name = `package-${Date.now()}`){

    let codes = [] ;

    for(let name of classes){

        let code = SourceCode.get(name) ;

        if(code){

            let {
                importAllSourceCodes
            } = code ;

            codes.push(...importAllSourceCodes , code) ;
        }
    }

    let result = require(`../package/${type}`)(unique(codes) , join(APPLICATION.getFolderPath('package') , name) , config) ;

    if(memory === true){

        return result ;
    }

    let paths = Object.keys(result) ;

    for(let path of paths){

        writeTextFile(path , result[path]) ;

        console.log('已生成' , path) ;
    }
}