const {
    apply
} = require('../template'),
{
    APPLICATION
} = require('../project'),
webpack = require('./webpack/native');

module.exports = (metas , {
    config,
    bootstrap,
    main,
    api,
    compatible = false
} , name) =>{

    const {
        defaultFolder
    } = APPLICATION ;

    let codeMap = {},
        names = Object.keys(metas);

    for(let name of names){

        codeMap[name] = metas[name].data ;
        
    }

    if(compatible){

        return webpack(apply('code.package.bundle.node.webpack' , {
            defaultFolder,
            codeMap,
            config,
            bootstrap,
            main,
            api
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
            main,
            api
        })
     } ;
    }
