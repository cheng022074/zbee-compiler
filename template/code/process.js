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
                type,
                data
            }) =>{

                if(type === 'call'){

                    process.send({
                        type:'call-result',
                        data:await include(entryName)(...data)
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

function send(entry , ...args){

    return new Promise((resolve , reject) =>{

        let onMessage = ({
            type,
            data
        }) =>{

            if(type === 'assist-result'){

                resolve(data) ;
            
                worker.off('message' , onMessage) ;

                worker.off('error' , reject) ;
            }
        };

        worker.on('message' , onMessage) ;

        worker.on('error' , reject) ;

        process.send({
            type:'assist',
            data:{
                entry,
                args
            }
        }) ;
    }) ;
}