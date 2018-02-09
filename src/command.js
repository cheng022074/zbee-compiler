{

    const {
        Code
    } = require('./code'),
    {
        defineExecuteOnceProperties
    } = require('./object'),
    {
        get
    } = require('./config');

    class Command{

        constructor(argv){
    
            this.argv = argv ;

            defineExecuteOnceProperties(this , [
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
    
            console.log('执行命令') ;
        }
    }

    Command.printCommandNameList = () =>{

        console.log('打印所有命令名称列表') ;
    }
    
    exports.Command = Command ;
}

{
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
}