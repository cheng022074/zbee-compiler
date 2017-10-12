const argv = process.argv ;

if(argv.length >= 3){

    let args = argv.slice(2);

    {
        let argv = exports.argv = [],
            execArgv = exports.execArgv = {};

        const execArgvRe = /^\-{2}([^\-\=]+)(?:\=(.+))?$/ ;

        for(let arg of args){
            
            let match = arg.match(execArgvRe) ;

            if(match){

                let value = match[2],
                    name = match[1].trim();

                if(value){

                    execArgv[name] = value ;
                
                }else{

                    execArgv[name] = undefined ;
                }

            }else if(!exports.hasOwnProperty('command')){

                exports.command = arg ;

            }else{

                argv.push(arg) ;
            }
        }   
    }
}