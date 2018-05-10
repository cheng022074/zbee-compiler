(() =>{

    function freeze(data){

        if (data && typeof data === 'object' && !Object.isFrozen(data)){

            Object.freeze(data);

            let names = Object.keys(data) ;

            for(let name of names){

                freeze(data[name]) ;
            }
        }

        return data;
    }

    const {
        readFileSync
    } = require('fs'),
    {
        join
    } = require('path'),
    dotRe = /\./g;

    return (name , key) =>{


        let target ;

        try{

            let configPath = process.env['ZBEE-APPLICATION-CONFIG-PATH'] ;

            if(configPath){

                target = JSON.parse(readFileSync(join(configPath , `${name.replace(dotRe , '/')}.json`))) ;
            }

        }catch(err){
        }

        if(!target){

            target = include(`config::${name}`) ;
        }

        if(!target){
    
            return ;
        }
    
        if(key){
    
            if(target.hasOwnProperty(key)){
        
                return target[key] ;
            }
        
            let names = key.split(/\./),
                prefix = '';
        
            for(let name of names){
        
                let key = `${prefix}${name}` ;
        
                if(target.hasOwnProperty(key)){
        
                    target = target[key] ;
        
                    prefix = '' ;
                
                }else{
        
                    prefix = `${key}.` ;
                }
            }
        
            if(prefix){
        
                return ;
            }
        }
    
        return freeze(target) ; 
    }

})()