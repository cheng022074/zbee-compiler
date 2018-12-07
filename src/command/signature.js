const {
    SourceCode
} = require('../code') ;

module.exports = name =>{

    if(name){

        let code = SourceCode.get(name) ;

        if(code.exists){

            console.info(code.signature) ;
        
        }else{

            console.log('资源不存在' , name) ;
        }

    }else{

        console.warn('请指定资源名称') ;
    }
}