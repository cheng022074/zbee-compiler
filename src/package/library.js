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
                motify:getProperty(code , 'motifyTime'),
                signature:getProperty(code , 'signature'),
                code:data,
                imports:getProperty(code , 'importAllNames'),
                entryTypes:getProperty(code , 'entryTypes')
            } ;
        }
    }

    return {
        [join(path , 'index.xml')]:apply('code.package.bundle.meta' , codeMap),
        [join(path , 'index.js')]:format(apply('code.package.bundle.lib' , codeMap))
     } ;
}