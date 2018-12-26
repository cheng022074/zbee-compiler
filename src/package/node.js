const {
    apply
} = require('../template'),
{
    join
} = require('path'),
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
    string:isString
} = rqeuire('../is');

module.exports = (codes , path , {
    config,
    bootstrap
}) =>{

    let codeMap = {} ;

    for(let code of codes){

        let data = getProperty(code , 'data') ;

        if(data){

            codeMap[code.fullName] = data ;
        }
    }

    const {
        defaultFolder
    } = APPLICATION ;

    if(isString(bootstrap)){

        let code = SourceCode.get(bootstrap) ;

        bootstrap = {
            types:getProperty(code , 'entryTypes'),
            name:bootstrap
        } ;

    }else{

        bootstrap = null ;
    }

    return {
        [join(path , 'index.js')]:format(apply('code.package.bundle.node' , {
            defaultFolder,
            codeMap,
            config
        }))
     } ;
}