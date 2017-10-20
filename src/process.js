const {
    argv:processArgv    
} = process,
{
    defineProperties
} = require('./object'),
{
    Command
} = require('./process/command'),
{
    string:is_string
} = require('./is'),
{
    PATH:COMPILER_PATH
} = require('./compiler'),
{
    PATH:APPLICATION_PATH,
    commandExists,
    getCommandImplementFunctionName
} = require('./application');


if(processArgv.length >= 3 && APPLICATION_PATH.indexOf(COMPILER_PATH) !== 0){

    let args = processArgv.slice(2),
        command,
        argv = [],
        execArgv = [];

    const execArgvRe = /^\-{1,2}([^\-\=]+)(?:\=(.+))?$/ ;

    for(let arg of args){
        
        let match = arg.match(execArgvRe) ;

        if(match){

            let value = match[2],
                name = match[1].trim();

            if(value){

                execArgv[name] = value.trim() ;
            
            }else{

                execArgv[name] = undefined ;
            }

        }else if(!command){

            command = arg ;

        }else{

            argv.push(arg) ;
        }
    }

    class CommandNotFoundException extends Exception{
        
        constructor(command){
    
            super(`命令 ${command} 不存在`) ;
    
            this.command = command ;
        }
    }
    
    exports.CommandNotFoundException = CommandNotFoundException ;

    if(is_string(command) && !commandExists(command)){

        throw new CommandNotFoundException(command) ;
    }

    exports.initialized = true ;

    exports.isHasCommand = is_string(command) ;

    exports.argv = argv ;

    exports.execArgv = execArgv ;

    defineProperties(exports , {

        command:{

            once:true,

            get:() =>{

                if(exports.isHasCommand){

                    return new Command(getCommandImplementFunctionName(command)) ;
                }
            }
        }
    }) ;

}else{

    exports.initialized = false ;
}