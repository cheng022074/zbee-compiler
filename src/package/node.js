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
    min
} = require('../script') ;

module.exports = (codes , {
    config,
    bootstrap,
    main,
    minify = false
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

    let code = apply('code.package.bundle.node' , {
        defaultFolder,
        codeMap,
        config,
        bootstrap,
        main
    }) ;

    if(minify === true){

        code = min(code) ;
    }

    return {
        ['index.js']:code
     } ;
}