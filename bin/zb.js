#!/usr/bin/env node

{
    const {
        file:isFile
    } = require('../src/is'),
    {
        join
    } = require('path'),{
        writeTextFile,
        readTextFile
    } = require('../src/fs'),
    path = join(process.cwd() , 'properties.json');

    if(!isFile(path)){

        writeTextFile(path , readTextFile(join(__dirname , '../template/properties.json'))) ;
    }
}

const {
    initApplicationPath
} = require('../src/path') ;

initApplicationPath(process.cwd()) ;

const {
    Command,
    CommandNotFoundException
} = require('../src/command');

let command = new Command(process.argv) ;

function on_error(err){

    if(err instanceof CommandNotFoundException){

        console.log('\n' , err.message) ;

        Command.printCommandNameList() ;
    
    }else{

        throw err ;
    }
}

if(command.exists){

    try{

        const {
            APPLICATION
        } = require('../src/project') ;

        APPLICATION.init() ;
    
        command.run().catch(on_error) ;

    }catch(err){

        on_error(err) ;
    }

}else{

    Command.printCommandNameList() ;
}
