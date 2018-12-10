const {
    SourceCode
} = require('../code'),
{
    format
} = require('../script');

module.exports = name =>{

    if(name){

        let code = SourceCode.get(name) ;

        if(code.exists){

            console.info(format(code.data)) ;
        
        }else{

            console.log('资源不存在' , name) ;
        }

    }else{

        console.warn('请指定资源名称') ;
    }
}