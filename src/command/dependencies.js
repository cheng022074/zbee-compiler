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

            for(let name of importAllNames){

                console.info(name) ;
            }
        
        }else{

            console.log('源代码不存在' , name) ;
        }

    }else{

        console.warn('请指定源代码名称') ;
    }
}