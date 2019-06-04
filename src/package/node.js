const {
    apply
} = require('../template'),
{
    SourceCode
} = require('../code'),
{
    APPLICATION
} = require('../project') ;

module.exports = (codes , {
    config,
    bootstrap,
    main
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

    return {
        ['index.js']:apply('code.package.bundle.node' , {
            defaultFolder,
            codeMap,
            config,
            bootstrap,
            main
        })
     } ;
}