const {
    SourceCode
} = require('../code'),
getSourceCodeNames = require('../../lib/code/source/names'),
Meta = require('../../lib/code/bin/meta');

module.exports = codeName =>{

    if(codeName){

        

        if(Meta.has(codeName)){

            let names = getSourceCodeNames('src::*'),
                isHas = false;
    
                for(let name of names){

                    let {
                        importNames
                    } = Meta.get(name) ;
    
                    if(importNames.includes(codeName)){
    
                        console.info(name) ;
    
                        isHas = true ;
                    }
                    
                }
    
                if(!isHas){
    
                    console.info('无被依赖') ;
                }
            
        }else{
    
            console.log('资源不存在或者尚未编译' , name) ;
        }
    
    }else{

        console.log('请指定资源名称') ;
    }
}