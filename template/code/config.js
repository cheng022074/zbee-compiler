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
    dotRe = /\./g,
    config = <%- data.hasOwnProperty('config') ? JSON.stringify(data.config) : '{}' %>;

    function get_config(target , key){

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

        if(!target){

            return ;
        }
    
        return freeze(target) ; 
    }

    return (name , key) =>{


        if(Object.keys(config).length){

            let value = get_config(config , key) ;

            if(value !== undefined){

                return value ;
            }
        }

        try{

            let configPath = process.env['ZBEE-APPLICATION-CONFIG-PATH'] ;

            if(configPath){

                value = get_config(JSON.parse(readFileSync(join(configPath , `${name.replace(dotRe , '/')}.json`))) , key) ;

                if(value !== undefined){

                    return value ;
                }
            }

        }catch(err){
        }

        value = get_config(include(`config::${name}`) , key) ;

        if(value !== undefined){

            return value ;
        }
    }

})()