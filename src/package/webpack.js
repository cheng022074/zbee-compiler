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

module.exports = async (codes , {
    config,
    entry,
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