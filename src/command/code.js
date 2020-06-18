const {
    format
} = require('../script'),
Meta = require('../../lib/code/bin/meta'),
getFullName = require('../../lib/code/source/name/full');

module.exports = name =>{

    if(name){

        name = getFullName(name) ;

        let meta = Meta.get(name) ;

        if(meta){

            console.info(format(meta.data)) ;
        
        }else{

            console.log('资源不存在或者尚未编译' , name) ;
        }

    }else{

        console.warn('请指定资源名称') ;
    }
}