const {
    APPLICATION,
} = require('../../project'),
webpack = require('webpack'),
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
} = require('../../fs'),
webpackConfig = require('./config');

module.exports = (data , config , name , isMinimize = false) =>{

    if(config === true){

        config = {} ;
    }

    let rootPath = join(APPLICATION.getFolderPath('bin') , '.package'),
        entry = join(rootPath , `${name}-index.js`) ;

    writeTextFile(entry , data) ;

    return new Promise(resolve =>{

        webpack(webpackConfig(name , entry , rootPath , config , isMinimize), (err, stats) => {

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

            let isError = false ;
        
            if(stats.hasErrors()){

                innerConsole.error('ERROR') ;

                innerConsole.error(print(info.errors));

                isError
            
            }else if(stats.hasWarnings()){

                innerConsole.error('WARN') ;

                let result = print(info.warnings) ;

                innerConsole.warn(result);

                console.warn(result) ;

            }

            if(!isError){
                
                resolve(`/* eslint-disable */ ${readTextFile(join(rootPath , `${name}-dist.js`))}`) ;
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

            if(typeof message === 'object'){

                message = message.message ;
            }

            result.push(message) ;
        }
    }

    return result.join('\n') ;
}