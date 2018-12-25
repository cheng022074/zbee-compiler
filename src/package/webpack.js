const {
    apply
} = require('../template'),
{
    SourceCode
} = require('../code'),
{
    getProperty
} = SourceCode,
{
    format
} = require('../script'),
{
    toFunctionName
} = require('../name'),
{
    APPLICATION
} = require('../project');

module.exports = (codes , path , {
    config
}) =>{

    let codeMap = {} ;

    for(let code of codes){

        let data = getProperty(code , 'data') ;

        if(data){

            let {
                fullName
            } = code ;

            codeMap[fullName] = {
                code:data,
                functionName:toFunctionName(fullName)
            } ;
        }
    }

    const {
        defaultFolder
    } = APPLICATION ;

    return {
        [`${path}.js`]:format(apply('code.package.bundle.webpack' , {
            defaultFolder,
            codeMap,
            config
        }))
     } ;
}