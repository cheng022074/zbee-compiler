{
    const {
        env
    } = process,
    entryName = env['ZBEE-ENTRY-NAME'];
    
    if(entryName){
    
        const {
            isWorker
        } = require('cluster'),
        entryFn = include(entryName);

        if(typeof entryFn === 'function'){

            if(isWorker){
    
                process.on('message' , async ({
                    type,
                    data
                }) =>{
    
                    if(type === 'master-send'){
    
                        process.send({
                            type:'master-send-result',
                            data:await entryFn(...data)
                        }) ;
                    }
        
                }) ;
        
            }else{
        
                let args = env['ZBEE-ENTRY-ARGS'] ;
        
                if(args){
        
                    args = JSON.parse(args) ;
                
                }else{
        
                    args = [] ;
                }
    
                (async () =>{
    
                    process.send(await entryFn(...args)) ;
    
                })() ;
            }
        }

    }else{

        <%

        const {
            bootstrap
        } = data ;

        if(bootstrap){
        %>
            include('<%- bootstrap %>')(process.argv.slice(2)) ;
        <%
        }
        %>
    }
}