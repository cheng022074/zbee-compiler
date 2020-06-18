const
Meta = require('../../lib/code/bin/meta'),
getFullName = require('../../lib/code/source/name/full');

module.exports = name =>{

    if(name){

        name = getFullName(name) ;

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

            console.log('资源不存在或者尚未编译' , name) ;
        }

    }else{

        console.warn('请指定资源名称') ;
    }
}