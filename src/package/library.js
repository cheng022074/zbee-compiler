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
} = Object;

module.exports = (codes , path) =>{

    let codeMap = {},
        dependencies = {};

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

            assign(dependencies , getProperty(code , 'dependentModules')) ;
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