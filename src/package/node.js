const {
    apply
} = require('../template'),
{
    SourceCode
} = require('../code'),
{
    APPLICATION
} = require('../project'),
webpack = require('./webpack/native');

module.exports = (codes , {
    config,
    bootstrap,
    main,
    compatible = false
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

    if(compatible){

        return webpack(apply('code.package.bundle.node.webpack' , {
            defaultFolder,
            codeMap,
            config,
            bootstrap,
            main
        }) , {
            target:'node'
        } , name) ;
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
