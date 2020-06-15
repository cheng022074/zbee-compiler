const {
    SourceCode
} = require('../code'),
getSourceCodeNames = require('../../lib/code/source/names');

module.exports = name =>{

    console.log(getSourceCodeNames('src::*')) ;

    return ;

    if(name){

        let {
            fullName:currentName,
            exists
        } = SourceCode.get(name) ;

        if(exists){

            let codes = SourceCode.getMany('*'),
                isHas = false;

            for(let {
                fullName,
                importNames
            } of codes){

                if(importNames.includes(currentName)){

                    console.info(fullName) ;

                    isHas = true ;
                }
                
            }

            if(!isHas){

                console.info('无被依赖') ;
            }
        
        }else{

            console.log('资源不存在' , name) ;
        }

    }else{

        console.warn('请指定资源名称') ;
    }
}