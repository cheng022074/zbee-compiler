{
    const {
        env
    } = process,
    entryName = env['ZBEE-ENTRY-NAME'];
    
    if(entryName){
    
        const {
            isWorker
        } = require('cluster') ;
    
        if(isWorker){
    
            process.on('message' , args =>{
    
                process.send(include(entryName)(...args)) ;
    
            }) ;
    
        }else{
    
            let args = env['ZBEE-ENTRY-ARGS'] ;
    
            if(args){
    
                args = JSON.parse(args) ;
            
            }else{
    
                args = [] ;
            }
    
            process.send(include(entryName)(...args)) ;
        }
    }

    return ;
}