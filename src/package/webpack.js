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
    APPLICATION
} = require('../project'),
{
    join,
    basename
} = require('path'),
{
    assign
} = Object,
{
    writeTextFile
} = require('../fs');

module.exports = (codes , path , {
    config,
    to
}) =>{

    const {
        defaultFolder
    } = APPLICATION ;

    let codeMap = {},
        dependencies = {};

    for(let code of codes){

        let data = SourceCode.getProperty(code , 'data') ;

        if(data){

            let {
                fullName
            } = code;

            codeMap[fullName] = data ;

            assign(dependencies , SourceCode.getProperty(code , 'dependentModules')) ;
        }
    }

    let name = basename(path).toLowerCase(),
        data = format(apply('code.package.bundle.webpack' , {
            defaultFolder,
            codeMap,
            config
        }));

    if(to){

        for(let path of to){

            writeTextFile(path , data) ;

            console.log('已导出' , path) ;
        }
    }

    return {
        [join(path , 'index.js')]:data,
        [join(path , 'package.json')]:apply('code.package.package' , {
            name,
            version:APPLICATION.version,
            dependencies
        })
     } ;
}