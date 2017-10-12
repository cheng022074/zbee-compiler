#!/usr/bin/env node

const args = Array.from(process.argv),
      {
        name2path
      } = require('../src/path'),
      {
          command,
          argv,
          execArgv
      } = require('../src/dev');

global.zb = {
    script:require('../src/script')
} ;

if(args.length >= 3){

    try{

        let result = require(`../command/${name2path(args[2])}`)(...args.slice(3)) ;
        
        if(result instanceof Promise){
    
            result.catch(err =>{
    
                console.log(err) ;
    
            }) ;
        }
    
    }catch(err){

        console.log(err) ;
    } 
}