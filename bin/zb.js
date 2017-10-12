#!/usr/bin/env node

const PROCESS = require('../src/process'),
      command = PROCESS.command;

if(command){

    const  {
        name2path,
        getCompilerPath
      } = require('../src/path'),
      {
          get:properties_get
      } = require('../src/properties'),
      {
          readJSONFile
      } = require('../src/fs'),
      {
        get:object_get
      } = require('../src/object');

    const {
        argv,
        execArgv
    } = PROCESS ;

    let env = object_get(readJSONFile(getCompilerPath('command.json')) , `${command}.env`) || execArgv.env;

    if(env){

        require('../src/environment').set(env) ;
    }

    global.zb = {
        script:require('../src/script')
    } ;

    try{
        
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