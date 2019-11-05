const {
    apply
} = require('../template'),
{
    SourceCode
} = require('../code'),
{
    APPLICATION
} = require('../project'),
{
    join
} = require('path');

module.exports = (codes , {
    config,
    name:packageName,
    path
} , name) =>{

    const {
        defaultFolder
    } = APPLICATION ;

    let codeMap = {};

    for(let code of codes){

        let data = SourceCode.getProperty(code , 'data') ;

        if(data){

            let {
                fullName
            } = code;

            codeMap[fullName] = data ;
        }
    }

    let dependencies = {},
        data = apply('code.package.bundle.browser' , {
            name:packageName || name,
            defaultFolder,
            codeMap,
            config
        });

    if(path){

        return {
            dependencies,
            rootPath:join(APPLICATION.rootPath , path),
            ['index.js']:data
         } ;
    }

    return {
        dependencies,
        ['index.js']:data
     } ;
}