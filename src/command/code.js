const {
    SourceCode
} = require('../code'),
{
    format
} = require('../script'),
Meta = require('../../lib/code/bin/meta');

module.exports = name =>{

    if(name){

        let meta = Meta.get(name) ;

        if(meta){

            console.info(format(meta.data)) ;
        
        }else{

            console.log('资源不存在' , name) ;
        }

    }else{

        console.warn('请指定资源名称') ;
    }
}