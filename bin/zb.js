#!/usr/bin/env node

const Exception = require('../src/exception') ;

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

        const application = require('../src/application') ;

        if(hasCommand){

            application.printCommandHelpInformation(process.command.name) ;
        
        }else{

            application.printCommandHelpInformations() ;
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