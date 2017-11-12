const {
    spawn
} = require('child_process'),
{
    isWindows
} = require('./os'),
{
    function:is_function
} = require('./is');

exports.exec = (...args) =>{

    let fn ;

    if(args.length){

        let value = args[args.length - 1] ;

        if(is_function(value)){

            fn = value ;

            args.pop() ;
        }
    }

    return new Promise(callback =>{

        let cp ;
        
        if(isWindows){
    
            cp = spawn('cmd.exe', ['/c' , ...args]) ;
        
        }else{
    
            cp = spawn(args[0], args.slice(1)) ;
        }
    
        let {
            stderr,
            stdout
        } = cp ;
    
        stdout.on('data', log.bind(fn));
        
        stderr.on('data', log.bind(fn));
        
        cp.on('close', ()=>{
            
            callback() ;

        });

        process.on('exit' , () =>{

            if(!cp.killed){

                cp.kill() ;
            }
            
        }) ;

    }) ;
}

function log(data){

    let result = data.toString('utf8') ;

    console.log(result) ;

    let fn = this ;

    if(is_function(fn)){

        fn(result.trim()) ;
    }
}