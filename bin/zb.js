#!/usr/bin/env node

const {
    command,
    argv,
    execArgv
} = require('../src/process'),
{
    executeCommand,
    COMMAND_NAMES
} = require('../src/application'),
{
    Exception
} = require('../src/exception');

if(command){

    try{

        executeCommand(command , ...argv) ;

    }catch(err){

        if(err instanceof Exception){

            console.log(err.message) ;
        
        }else{

            console.log(err) ;
        }

    }

}else{

    for(let name of COMMAND_NAMES){

        console.log(name) ;
    }
}