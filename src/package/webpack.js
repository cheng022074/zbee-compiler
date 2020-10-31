const {
    apply
} = require('../template'),
{
    APPLICATION
} = require('../project'),
webpack = require('./webpack/native'),
Meta = require('../../lib/code/bin/meta'),
{
    defaultFolder
} = APPLICATION;

module.exports = async (metas , {
    config,
    entry,
    webpack:webpackConfig,
    packages = []
} , name) =>{

    let data = apply('code.package.bundle.webpack' , {
            defaultFolder,
            codeMap:generateCodeMap(metas),
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
            ['index.dev.js']:await webpack(data , webpackConfig , name , false),
            ...doPackages(packages , metas , config)
        } ;
    
    }

    return {
        ['index.js']:data,
        ...doPackages(packages , metas , config)
    } ;
}

function doPackages(packages , metas , config){

    let names = Object.keys(packages),
        result = {};

    for(let name of names){

        result[`index/${name}.js`] = apply('code.package.bundle.webpack' , {
            defaultFolder,
            codeMap:generateCodeMap(doPackage(packages[name] , metas)),
            config
        }) ;
    }

    return result ;
}

function doPackage(names , metas , packageClassNames = []){

    let result = {} ;

    for(let name of names){

        if(metas.hasOwnProperty(name) && !packageClassNames.includes(name)){

            result[name] = metas[name] ;

            packageClassNames.push(name) ;

            Object.assign(result , doPackage(Meta.getImportAllNames(name) , metas , packageClassNames)) ;
        }
    }

    return result ;
}

function generateCodeMap(metas) {
    
    let codeMap = {},
        names = Object.keys(metas);

    for(let name of names){

        codeMap[name] = metas[name].data ;
        
    }

    return codeMap ;
}