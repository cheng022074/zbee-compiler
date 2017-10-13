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

    try{

        require('babel-polyfill') ;        
        
        let result = require(`../command/${name2path(command)}`)(...argv) ;
        
        if(result instanceof Promise){
    
            result.catch(err =>{
    
                console.log(err) ;
    
            }) ;
        }
    
    }catch(err){

        console.log(err) ;
    }
}