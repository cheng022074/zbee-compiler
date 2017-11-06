const application = require('../src/application'),
{
    encode
} = require('../src/object/key');

module.exports = name =>{

    if(name){

        let code = application.getSourceCode(name) ;
        
        if(code){

            compile(code) ;

            let codes = code.importAllSourceCodes ;
            
            for(let code of codes){

                compile(code) ;
            }

        }else{

            console.log('未找到代码' , name) ;
        }

    }else{

        console.log('请指定代码名称') ;
    }
}

function compile(code){

    let suffix = encode(code.suffix),
        scope = code.scope,
        fromName = application.get(`compile.${scope}.${suffix}.from`),
        toName = application.get(`compile.${scope}.${suffix}.to`) ;

    if(fromName && toName){

        let codeStr = application.executeBinCode(fromName , code) ;

        if(codeStr){

            let path = application.executeBinCode(toName , codeStr , code) ;

            if(path){

                console.log('已编译' , path) ;
            }
        }
    }
}