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
        join
    } = require('path'),
    {
        assign
    } = Object,
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

        let value ;

        if(!key){

            let result = {} ;

            try{

               assign(result , include(`config::${name}`)) ;
                
            }catch(err){
    
            }

            if(config.hasOwnProperty(name)){

                assign(result , config[name]) ;
            }

            return result ;
        }


        if(config.hasOwnProperty(name)){

            value = get_config(config[name] , key) ;

            if(value !== undefined){

                return value ;
            }
        }

        try{

            value = get_config(include(`config::${name}`) , key) ;

            if(value !== undefined){

                return value ;
            }

        }catch(err){

        }

        
    }

})()