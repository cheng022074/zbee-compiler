const 
Meta = require('../../lib/code/bin/meta'),
getFullName = require('../../lib/code/source/name/full'),
compile = require('./compile');

module.exports = name =>{

    if(name){

        compile(name) ;

        name = getFullName(name) ;

        let meta = Meta.get(name) ;

        if(meta){

            console.info(meta.signature) ;
        
        }else{

            console.log('资源不存在或者尚未编译' , name) ;
        }

    }else{

        console.warn('请指定资源名称') ;
    }
}