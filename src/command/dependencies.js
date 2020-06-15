const {
    SourceCode
} = require('../code'),
Meta = require('../../lib/code/bin/meta');

module.exports = name =>{

    if(name){

        if(Meta.has(name)){

            let importAllNames = Meta.getImportAllNames(name) ;

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