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
    toPropertyValue:toObjectPropertyValue
} = require('../object'),
{
    toPropertyValue:toArrayPropertyValue
} = require('../array');

module.exports = codes =>{

    let codeMap = {};

    for(let code of codes){

        let data = SourceCode.getProperty(code , 'data') ;

        if(data){

            let dependentModules = SourceCode.getProperty(code , 'dependentModules') ;

            codeMap[code.fullName] = {
                motify:SourceCode.getProperty(code , 'motifyTime'),
                signature:SourceCode.getProperty(code , 'signature'),
                code:data,
                imports:toArrayPropertyValue(SourceCode.getProperty(code , 'importAllNames')),
                entryTypes:toArrayPropertyValue(SourceCode.getProperty(code , 'entryTypes')),
                dependentModules:toObjectPropertyValue(dependentModules)
            } ;
        }
    }

    return {
        ['index.xml']:apply('code.package.bundle.meta' , codeMap),
        ['index.js']:format(apply('code.package.bundle.lib' , codeMap))
     } ;
}