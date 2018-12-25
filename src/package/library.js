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
} = require('../script');

module.exports = (codes , path) =>{

    let codeMap = {} ;

    for(let code of codes){

        let data = getProperty(code , 'data') ;

        if(data){

            codeMap[code.fullName] = {
                code:data,
                imports:getProperty(code , 'importAllNames')
            } ;
        }
    }

    return {
        [join(path , 'index.xml')]:apply('code.package.bundle.meta' , codeMap),
        [join(path , 'index.js')]:format(apply('code.package.bundle.lib' , codeMap))
     } ;
}