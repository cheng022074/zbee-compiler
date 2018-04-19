#!/usr/bin/env node

const {
    initApplicationPath
} = require('../src/path') ;

initApplicationPath(process.cwd()) ;

const {
    Command,
    CommandNotFoundException
} = require('../src/command');

let command = new Command(process.argv) ;

if(command.exists){

    try{

        const {
            APPLICATION
        } = require('../src/project'),
        {
            env
        } = process;

        env['ZBEE-APP-BIN-PATH'] = APPLICATION.getFolderPath('bin') ;

        command.run() ;

    }catch(err){

        if(err instanceof CommandNotFoundException){

            console.log('\n' , err.message) ;

            Command.printCommandNameList() ;
        
        }else{

            throw err ;
        }
    }

}else{

    Command.printCommandNameList() ;
}

