#!/usr/bin/env node

const {
    command,
    argv,
    execArgv
} = require('../src/process'),
{
    executeCommand
} = require('../src/application');

if(command){

    executeCommand(command) ;

}else{

    // 未指定命令
}