const {
    apply
} = require('../template'),
{
    join,
    basename
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
    assign
} = Object,
{
    toPropertyValue:toObjectPropertyValue
} = require('../object'),
{
    toPropertyValue:toArrayPropertyValue
} = require('../array');

module.exports = (codes , path) =>{

    let codeMap = {},
        dependencies = {};

    for(let code of codes){

        let data = getProperty(code , 'data') ;

        if(data){

            let dependentModules = getProperty(code , 'dependentModules') ;

            codeMap[code.fullName] = {
                motify:getProperty(code , 'motifyTime'),
                signature:getProperty(code , 'signature'),
                code:data,
                imports:toArrayPropertyValue(getProperty(code , 'importAllNames')),
                entryTypes:toArrayPropertyValue(getProperty(code , 'entryTypes')),
                dependentModules:toObjectPropertyValue(dependentModules)
            } ;

           assign(dependencies , dependentModules) ;

        }
    }

    let name = basename(path).toLowerCase() ;

    return {
        [join(path , 'index.xml')]:apply('code.package.bundle.meta' , codeMap),
        [join(path , 'index.js')]:format(apply('code.package.bundle.lib' , codeMap)),
        [join(path , 'package.json')]:apply('code.package.package' , {
            name,
            dependencies
        })
     } ;
}