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