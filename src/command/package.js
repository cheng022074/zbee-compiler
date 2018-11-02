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

            return doPackage(config[name] , name) ;
        }
    
    }else if(isObject(name)){

        let {
            name:packageName,
            ...packageConfig
        } = name ;

        return doPackage(packageConfig , packageName || `package-${Date.now()}`) ;

    }else{

        let config = get('package' , name) ;

        if(config){

            return doPackage(config , name) ;
        
        }else{

            console.log('无效打包配置' , name) ;
        }
    }

}

function doPackage({
    classes,
    type = 'library',
    memory = false,
    ...packageConfig
} , packageName){

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

    let result = require(`../package/${type}`)(unique(codes) , join(APPLICATION.getFolderPath('package') , packageName) , packageConfig) ;

    if(memory){

        return result ;
    }

    let paths = Object.keys(result) ;

    for(let path of paths){

        writeTextFile(path , result[path]) ;

        console.log('已生成' , path) ;
    }
}