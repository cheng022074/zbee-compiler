const application = require('../src/application'),
{
    get,
    executeBinCode
} = application,
{
    encode
} = require('../src/object/key');

module.exports = name =>{

    if(name){

        let code = application.getSourceCode(name) ;
        
        if(code){

            console.log(code.meta) ;
    
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
        fromName = get(`compile.${scope}.${suffix}.from`),
        toName = get(`compile.${scope}.${suffix}.to`) ;

    if(fromName && toName){

        let codeStr = executeBinCode(fromName , code) ;

        if(codeStr){

            let path = executeBinCode(toName , codeStr , code) ;

            if(path){

                console.log('已编译' , path) ;
            }
        }
    }
}