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

        let {
            folder,
            name:baseName
        } = parse(name , APPLICATION.defaultFolder) ;

        writeTextFile(APPLICATION.generateBinPath(folder , baseName) , code.target.binCodeText) ;

        console.log('已生成' , name) ;
    
    }else{

        console.log('不存在' , name) ;
    }
}