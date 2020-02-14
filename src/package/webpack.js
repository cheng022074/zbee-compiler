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
    writeTextFile,
    readTextFile
} = require('../fs'),
webpack = require('webpack'),
webpackMerge = require('webpack-merge'),
{
    Console
} = require('console'),
{
    createWriteStream
} = require('fs');

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

        if(webpackConfig === true){

            webpackConfig = {} ;
        }

        let rootPath = join(APPLICATION.getFolderPath('bin') , '.package'),
            entry = join(rootPath , `${name}-index.js`) ;

        writeTextFile(entry , data) ;

        return new Promise(resolve =>{

            webpack(webpackMerge({
                mode:'production',
                optimization: {
                    minimize: false
                },
                context:COMPILER.rootPath,
                entry,
                output:{
                    filename:`${name}-dist.js`,
                    path:rootPath,
                    library:name,
                    libraryTarget:'umd'
                },
                resolve: {
                    modules: [
                        join(COMPILER.rootPath , 'node_modules'),
                        join(APPLICATION.rootPath , 'node_modules')
                    ]
                },
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
    
                let console = new Console(createWriteStream(join(rootPath , `${name}.log`))) ;
        
                if(err){
    
                    console.error(err.stack || err);
                    
                    if (err.details) {
                      
                        console.error(err.details);
                    }
    
                    return;
                }
                
                const info = stats.toJson();
            
                if(stats.hasErrors()){
    
                    console.error(info.errors);
                
                }else if(stats.hasWarnings()){
                
                    console.warn(info.warnings);
    
                }else{

                    let distPath = join(rootPath , `${name}-dist.js`),
                        data = readTextFile(distPath) ;

                    resolve({
                        ['index.js']:data
                    }) ;
                }
            });

        }) ;
    
    }

    return {
        ['index.js']:data
    } ;
}