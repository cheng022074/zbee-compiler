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
} = require('./is');

if(processArgv.length >= 3){

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

    defineProperties(exports , {

        hasCommand:{

            once:true,

            get:() =>{

                return is_string(command) ;
            }
        },

        command:{

            once:true,

            get:() =>{

                return new Command(command) ;
            }
        },

        argv:{
            
            get:() =>{

                return argv ;
            }
        },

        execArgv:{

            get:() =>{

                return execArgv ;
            }
        }

    }) ;
}