const {
    SourceCode
} = require('../code') ;

module.exports = name =>{

    if(name){

        let code = SourceCode.get(name) ;

        if(code.exists){

            let {
                importAllNames
            } = code ;

            if(importAllNames.length){

                for(let name of importAllNames){

                    console.info(name) ;
                }

            }else{

                console.info('无依赖') ;
            }

        }else{

            console.log('资源不存在' , name) ;
        }

    }else{

        console.warn('请指定资源名称') ;
    }
}