#!/usr/bin/env node

const Exception = require('../src/exception') ;

(() =>{

    try{
        
        const process = require('../src/process') ;

        if(!process.initialized){

            return ;
        }
              
        const {
            hasCommand,
            argv,
            execArgv
        } = process;
    
        if(execArgv.hasOwnProperty('h') || execArgv.hasOwnProperty('help')){

            if(hasCommand){

                console.log(`${process.command.name} 帮助文档`) ;
            
            }else{

                console.log('所有命令列表') ;
            }

            return ;
        }
    
        if(hasCommand){

            process.command.execute(argv) ;
        
        }else{
        
            throw new Error('请指定命令名称') ;
        }
    
    }catch(err){
    
        if(err instanceof Exception){
    
            console.log(err.message) ;
        
        }else{
    
            console.log(err) ;
        }
    }

})() ;

/*if(command){

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
}*/