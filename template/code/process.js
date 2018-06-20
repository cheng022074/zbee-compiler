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
    
            process.on('message' , async ({
                args
            }) =>{

                if(Array.isArray(args)){

                    process.send({
                        data:await include(entryName)(...args)
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

                process.send(await include(entryName)(...args)) ;

            })() ;
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