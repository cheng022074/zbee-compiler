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
            ['index.asm.js']:data,
            ['index.js']:`
              if (process.env.NODE_ENV === 'production') {
                module.exports = require('./index.prod.js')
              } else {
                module.exports = require('./index.dev.js')
              }
              
            `,
            ['index.prd.js']:await webpack(data , webpackConfig , name , true),
            ['index.dev.js']:await webpack(data , webpackConfig , name , false)
        } ;
    
    }

    return {
        ['index.js']:data
    } ;
}