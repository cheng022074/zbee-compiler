const {
    APPLICATION,
    COMPILER
} = require('../../project'),
{
    rootPath:COMPILER_ROOTPATH
} = COMPILER,
{
    rootPath:APPLICATION_ROOTPATH
} = APPLICATION,
{
    merge:webpackMerge
} = require('webpack-merge'),
{
    MAX_VALUE
} = Number,
{
    capitalize,
    split
} = require('../../string'),
{
    join
} = require('path');

function getLibraryName(name){

    let names = split(name , /\-/),
        result = [];

    for(let name of names){

        result.push(capitalize(name)) ;
    }

    return result.join('') ;
}

module.exports = (name , entry , outputPath , config , isMinimize) =>{

    let webpackConfig = {
        mode:'production',
        optimization: {
            minimize: isMinimize
        },
        context:COMPILER_ROOTPATH,
        entry,
        performance:{
            maxEntrypointSize:MAX_VALUE,
            maxAssetSize:MAX_VALUE
        },
        output:{
            filename:`${name}-dist.js`,
            path:outputPath,
            library:getLibraryName(name),
            libraryTarget:'umd'
        },
        resolve: {
            modules: [
                join(APPLICATION_ROOTPATH , 'node_modules'),
                join(COMPILER_ROOTPATH , 'node_modules')
            ]
        },
        module: {
            unknownContextCritical:false,
            rules:[]
        }
    } ;

    if(isMinimize){

        webpackConfig.module.rules.push({
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    compact:false,
                    cacheDirectory:true,
                    presets: [
                        '@babel/preset-env'
                    ],
                    plugins: [
                        [
                            '@babel/plugin-transform-runtime',
                            {
                                corejs:{
                                    version:3,
                                    proposals:true
                                }
                            }
                        ]
                    ]
                }
            }
        }) ;
    }

    return webpackMerge(webpackConfig , config) ;
}