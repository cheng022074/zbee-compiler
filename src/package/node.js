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
    string:isString
} = require('../is'),
{
    APPLICATION
} = require('../project'),
{
    assign
} = Object;

module.exports = (codes , path , {
    config,
    bootstrap,
    main
}) =>{

    let codeMap = {},
        dependencies = {};

    for(let code of codes){

        let data = SourceCode.getProperty(code , 'data') ;

        if(data){

            codeMap[code.fullName] = data ;
        }

        assign(dependencies , SourceCode.getProperty(code , 'dependentModules')) ;

    }

    const {
        defaultFolder
    } = APPLICATION ;

    if(isString(bootstrap)){

        let code = SourceCode.get(bootstrap) ;

        bootstrap = {
            types:SourceCode.getProperty(code , 'entryTypes'),
            name:bootstrap
        } ;

    }else{

        bootstrap = null ;
    }

    let name = basename(path).toLowerCase() ;

    return {
        [join(path , 'index.js')]:format(apply('code.package.bundle.node' , {
            defaultFolder,
            codeMap,
            config,
            bootstrap,
            main
        })),
        [join(path , 'package.json')]:apply('code.package.package' , {
            name,
            dependencies
        })
     } ;
}