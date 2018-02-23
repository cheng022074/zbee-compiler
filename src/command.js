{

    const {
        Code
    } = require('./code'),
    {
        defineCacheProperties
    } = require('./object'),
    {
        get,
        keys
    } = require('./config');

    class Command{

        constructor(){

            let me = this ;
    
            me.argv = process.argv ;

            defineCacheProperties(me , [
                'name',
                'code'
            ]) ;
        }
    
        applyName(){
    
            let me = this,
            {
                argv
            } = me ;

            if(me.exists){

                return argv[2] ;

            }else{

                throw new CommandNotDefinedException() ;
            }
        }

        applyCode(){

            let name = this.name,
                codeName = get('command' , name) ;

            if(codeName){

                return new Code(codeName) ;
            }

            throw new CommandNotFoundException(name) ;
        }
    
        get exists(){
    
            let {
                argv
            } = this ;

            return argv.length >= 3 ;
        }
    
        run(){

            let {
                code
            } = this ;

            code.run() ;
        }
    }

    Command.printCommandNameList = () =>{

        let names = keys('command') ;

        console.log('\n' , '可用命令:') ;

        for(let name of names){

            console.log('\t' , name) ;
        }
    }
    
    exports.Command = Command ;
}

const {
    NotDefinedException,
    NotFoundException
} = require('./exception') ;

class CommandNotFoundException　extends NotFoundException{

    constructor(name){

        super('命令' , name) ;
    }
}

exports.CommandNotFoundException　= CommandNotFoundException ;

class CommandNotDefinedException extends NotDefinedException{

    constructor(){

        super('命令') ;
    }
}

exports.CommandNotDefinedException = CommandNotDefinedException ;