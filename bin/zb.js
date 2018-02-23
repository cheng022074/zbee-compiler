const {
    Command,
    CommandNotFoundException
} = require('../src/command') ;

let command = new Command() ;

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