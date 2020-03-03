const {
    APPLICATION,
    COMPILER
} = require('../../project'),
webpack = require('webpack'),
webpackMerge = require('webpack-merge'),
{
    join
} = require('path'),
{
    Console
} = require('console'),
{
    createWriteStream
} = require('fs'),
{
    writeTextFile,
    readTextFile
} = require('../../fs');

module.exports = (data , config , name) =>{

    if(config === true){

        config = {} ;
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
                    join(APPLICATION.rootPath , 'node_modules'),
                    join(COMPILER.rootPath , 'node_modules')
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
        } , config), (err, stats) => {

            let innerConsole = new Console(createWriteStream(join(rootPath , `${name}.log`))) ;
    
            if(err){

                innerConsole.error(err.stack || err);
                
                if (err.details) {

                    innerConsole.error('ERROR') ;
                  
                    innerConsole.error(print(err.details));
                }

                return;
            }
            
            const info = stats.toJson();
        
            if(stats.hasErrors()){

                innerConsole.error('ERROR') ;

                innerConsole.error(print(info.errors));
            
            }else if(stats.hasWarnings()){

                innerConsole.error('WARN') ;

                let result = print(info.warnings) ;

                innerConsole.warn(result);

                console.warn(result) ;

                let distPath = join(rootPath , `${name}-dist.js`),
                    data = readTextFile(distPath) ;

                resolve({
                    ['index.js']:data
                }) ;

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

function print(messages){

    let result = [] ;

    for(let message of messages){

        if(typeof message === 'array'){

            result.push(...print(messages)) ;
        
        }else{

            result.push(message) ;
        }
    }

    return result.join('\n') ;
}