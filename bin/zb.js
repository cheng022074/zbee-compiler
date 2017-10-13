#!/usr/bin/env node

const PROCESS = require('../src/process'),
      command = PROCESS.command;

if(command){

    const  {
        name2path,
        getCompilerPath
      } = require('../src/path');

    const {
        argv,
        execArgv
    } = PROCESS ;

    let env = execArgv.env;

    if(env){

        require('../src/environment').set(env) ;
    }

    global.zb = {
        script:require('../src/script')
    } ;

    let commandPath = `../command/${name2path(command)}`,
        errorMessage = `Cannot find module '${commandPath}'`;

    try{

        require('babel-polyfill') ;
   
        let result = require(commandPath)(...argv) ;

        if(result instanceof Promise){
    
            result.catch(err =>{
    
                console.log(err) ;
    
            }) ;
        }
    
    }catch(err){

        if(err.message === errorMessage){

            console.log(command , '命令不存在') ;
        
        }else{

            console.log(err) ;
        }
    }
}