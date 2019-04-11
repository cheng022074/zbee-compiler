const {
    apply
} = require('../template'),
{
    SourceCode
} = require('../code'),
{
    compile
} = require('../script'),
{
    APPLICATION
} = require('../project');

module.exports = (codes , {
    config,
    transform = true
}) =>{

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

    let dependencies = {} ;

    if(transform){

        dependencies['@babel/runtime-corejs3'] = '^7.4.2' ;

    }

    return {
        dependencies,
        ['index.js']:compile(apply('code.package.bundle.webpack' , {
            defaultFolder,
            codeMap,
            config
        }) , transform)
     } ;
}