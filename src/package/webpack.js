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
    webpack:webpackConfig
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

    let data = apply('code.package.bundle.webpack' , {
            defaultFolder,
            codeMap,
            config
        });

    if(webpackConfig){

        return webpack(data , webpackConfig , name) ;
    
    }

    return {
        ['index.js']:data
    } ;
}