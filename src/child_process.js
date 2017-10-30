const {
    spawn
} = require('child_process'),
{
    isWindows
} = require('./os');

exports.exec = (...args) =>{

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
    
        stdout.on('data', log);
        
        stderr.on('data', log);
        
        cp.on('exit', ()=>{
            
            callback() ;

        });

    }) ;
}

function log(data){

    console.log(data.toString('utf8')) ;
}