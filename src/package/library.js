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
} = require('../array'),
{
    writeTextFile
} = require('../fs');

module.exports = (codes , path , {
    to
}) =>{

    let codeMap = {},
        dependencies = {};

    for(let code of codes){

        let data = getProperty(code , 'data') ;

        if(data){

            let dependentModules = SourceCode.getProperty(code , 'dependentModules') ;

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

    let name = basename(path).toLowerCase(),
        xmlData = apply('code.package.bundle.meta' , codeMap),
        jsData = format(apply('code.package.bundle.lib' , codeMap));

    if(to){

        for(let path of to){

            writeTextFile(join(path , 'index.xml') , xmlData) ;

            writeTextFile(join(path , 'index.js') , jsData) ;

            console.log('已导出' , path) ;
        }
    }

    return {
        [join(path , 'index.xml')]:xmlData,
        [join(path , 'index.js')]:jsData,
        [join(path , 'package.json')]:apply('code.package.package' , {
            name,
            dependencies
        })
     } ;
}