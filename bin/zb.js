#!/usr/bin/env node

const {
    command,
    argv,
    execArgv
} = require('../src/process'),
{
    executeCommand,
    COMMAND_NAMES
} = require('../src/application');

if(command){

    executeCommand(command , ...argv) ;

}else{

    for(let name of COMMAND_NAMES){

        console.log(name) ;
    }
}