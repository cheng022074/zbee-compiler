const {
    argv:processArgv    
} = process;

if(processArgv.length >= 3){

    let args = processArgv.slice(2),
        command,
        argv = exports.argv = [],
        execArgv = exports.execArgv = [];

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

    exports.command = command ;
}