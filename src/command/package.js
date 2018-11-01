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
} = require('../array');

module.exports = name =>{

    if(!name){

        const 
        config = get('package'),
        names = Object.keys(config);

        for(let name of names){

            doPackage(config[name] , name) ;
        }
    
    }else if(isObject(name)){

        let {
            name:packageName,
            ...packageConfig
        } = name ;

        doPackage(packageConfig , packageName) ;

    }else{

        let config = get('package' , name) ;

        if(config){

            doPackage(config , name) ;
        
        }else{

            console.log('无效打包配置' , name) ;
        }
    }

}

function doPackage({
    classes,
    type = 'library',
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

    require(`../package/${type}`)(unique(codes) , join(APPLICATION.getFolderPath('package') , packageName) , packageConfig) ;
}