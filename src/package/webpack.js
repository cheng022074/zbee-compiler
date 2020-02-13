const {
    apply
} = require('../template'),
{
    SourceCode
} = require('../code'),
{
    APPLICATION,
    COMPILER
} = require('../project'),
{
    join
} = require('path'),
{
    writeTextFile
} = require('../fs'),
webpack = require('webpack'),
webpackMerge = require('webpack-merge');

module.exports = (codes , {
    config,
    webpack:webpackConfig
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

    let data = apply('code.package.bundle.webpack' , {
            defaultFolder,
            codeMap,
            config
        });

    

    let rootPath = join(APPLICATION.getFolderPath('bin') , Date.now().toString()),
        entry = join(rootPath , 'src.js') ;

    writeTextFile(entry , data) ;

    if(webpackConfig){

        if(webpackConfig === true){

            webpackConfig = {} ;
        }

        webpack(webpackMerge({
            mode:'production',
            optimization: {
                minimize: false
            },
            context:COMPILER.rootPath,
            entry,
            output:{
                filename:'dist.js',
                path:rootPath
            },
            resolve: {
                modules: [
                    join(COMPILER.rootPath , 'node_modules')
                ]
            },
            target:'electron-renderer',
            module: {
                rules:[{
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
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
                }]
            }
        } , webpackConfig), (err, stats) => {
    
            if (err || stats.hasErrors()){
    
                console.log(err , stats.toJson().errors) ;
            }
        });
    
    }

    return {
        ['index.js']:data
    } ;
}