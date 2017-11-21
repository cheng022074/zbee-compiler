#!/usr/bin/env node

const {
    command,
    argv,
    execArgv
} = require('../src/process'),
application = require('../src/application'),
{
    Exception
} = require('../src/exception'),
{
    empty:is_empty,
    simpleObject:is_simple_object,
    directory:is_directory
} = require('../src/is'),
{
    format
} = require('../src/json'),
{
    join
} = require('path');

global.ZBEE_APPLICATION = application ;

if(execArgv && execArgv.project){

    let path = join(process.cwd() , execArgv.project) ;

    if(is_directory(path)){

        application.PATH = path ;
    }
}

if(command){

    function doResult(result){

        if(is_simple_object(result)){

            console.log(format(result)) ;
        
        }else if(!is_empty(result)){

            console.log(result) ;
        }
    }

    function doError(err){

        if(err instanceof Exception){

            console.log(err.message) ;
        
        }else{

            console.log(err) ;
        }
    }

    try{

        let result = application.executeCommand(command , ...argv) ;

        if(result instanceof Promise){

            result
                .then(doResult)
                .catch(doError);
        }else{

            doResult(result) ;

        }

    }catch(err){

       
        doError(err) ;
    }

}else{

    for(let name of application.COMMAND_NAMES){

        console.log(name) ;
    }
}