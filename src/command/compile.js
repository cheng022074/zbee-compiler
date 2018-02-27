const {
    SourceCode
} = require('../code'),
{
    APPLICATION
} = require('../project'),
{
    parse
} = require('../name'),
{
    writeTextFile
} = require('../fs');

module.exports = name =>{

    let code = SourceCode.get(name) ;

    if(code.exists){

        compile(code) ;

        let {
            importAllSourceCodes
        } = code ;

        for(let code of importAllSourceCodes){

            compile(code) ;
        }
    
    }else{

        console.log('不存在' , name) ;
    }
}

function compile(code){

    let {
        name
    } = code ;

    writeTextFile(APPLICATION.generateBinPath(code.folder , name) , code.target.binCodeText) ;

    console.log('已生成' , name) ;
}