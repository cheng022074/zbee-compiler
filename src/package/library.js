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

module.exports = (codes) =>{

    let docs = {},
        classes = {};

    for(let code of codes){

        let data = SourceCode.getProperty(code , 'data') ;

        if(data){

            let isStandard = SourceCode.getProperty(code , 'isStandard'),
            {
                fullName
            } = code;

            docs[fullName] = {
                motify:SourceCode.getProperty(code , 'motifyTime'),
                signature:SourceCode.getProperty(code , 'signature'),
                code:data,
                imports:toArrayPropertyValue(SourceCode.getProperty(code , 'importAllNames')),
                entryTypes:toArrayPropertyValue(SourceCode.getProperty(code , 'entryTypes')),
                dependentModules:toObjectPropertyValue(SourceCode.getProperty(code , 'dependentModules')),
                standard:SourceCode.getProperty(code , 'isStandard') ? 'yes' : 'no'
            } ;

            if(isStandard){

                classes[fullName] = data ;
            
            }
        }
    }

    let result = {
        ['index.xml']:apply('code.package.bundle.meta' , docs)
    } ;

    result['index.js'] =  format(apply('code.package.bundle.lib' , classes));

    return result ;
}