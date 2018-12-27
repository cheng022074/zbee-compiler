const {
    apply
} = require('../template'),
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
    toFunctionName
} = require('../name'),
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

        let data = getProperty(code , 'data') ;

        if(data){

            let {
                fullName,
                name,
                folder
            } = code,
            innerName;

            switch(name){

                case 'include':
                case 'config':

                    innerName = fullName ;

                    break ;

                default:

                    if(defaultFolder === folder){

                        innerName = name ;
                    
                    }else{

                        innerName = fullName ;
                    }
            }

            codeMap[fullName] = {
                code:data,
                functionName:toFunctionName(innerName)
            } ;

            assign(dependencies , getProperty(code , 'dependentModules')) ;
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
            dependencies
        })
     } ;
}