const {
    apply
} = require('../template'),
{
    SourceCode
} = require('../code'),
{
    format
} = require('../script'),
{
    APPLICATION
} = require('../project');

module.exports = (codes , {
    config
}) =>{

    const {
        defaultFolder
    } = APPLICATION ;

    let codeMap = {};

    for(let code of codes){

        let data = SourceCode.getProperty(code , 'data') ;

        if(data){

            let {
                fullName
            } = code;

            codeMap[fullName] = data ;
        }
    }

    return {
        ['index.js']:format(apply('code.package.bundle.webpack' , {
            defaultFolder,
            codeMap,
            config
        }))
     } ;
}