const {
    SourceCode
} = require('../code') ;

module.exports = name =>{

    if(name){

        let signature = SourceCode.getProperty(SourceCode.get(name) , 'signature') ;

        if(signature){

            console.info(signature) ;
        
        }else{

            console.log('资源不存在' , name) ;
        }

    }else{

        console.warn('请指定资源名称') ;
    }
}