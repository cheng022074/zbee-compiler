const {
    apply
} = require('../template'),
{
    APPLICATION
} = require('../project'),
webpack = require('./webpack/native');

module.exports = async (metas , {
    config,
    entry,
    webpack:webpackConfig
} , name) =>{

    const {
        defaultFolder
    } = APPLICATION ;

    let codeMap = {},
        names = Object.keys(metas);

    for(let name of names){

        codeMap[name] = metas[name].data ;
        
    }

    let data = apply('code.package.bundle.webpack' , {
            defaultFolder,
            codeMap,
            config,
            entry
        });

    if(webpackConfig){

        return {
            ['index.js']:await webpack(data , webpackConfig , name , true),
            ['index-debug.js']:await webpack(data , webpackConfig , name , false)
        } ;
    
    }

    return {
        ['index.js']:data
    } ;
}