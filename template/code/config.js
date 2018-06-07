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

    function init(data){

        switch(gettype(data)){

            case 'array':

                return [
                    ...data
                ] ;

            case 'object':

                return {
                    ...data
                } ;
        }
    }

    function assign(result , data){

        switch(gettype(result)){

            case 'array':

                return result.push(...data) ;

            case 'object':

                return Object.assign(result , data) ;

            case 'undefined':

                switch(gettype(data)){

                    case 'array':

                        result = [] ;

                        break ;

                    case 'object':

                        result = {} ;

                        break ;
                }

                return assign(result , data) ;
        }
    }

    return (name , key) =>{

        let value ;

        if(!key){

            let result ;

            try{

                result = init(include(`config::${name}`)) ;
                
            }catch(err){
    
            }

            if(config.hasOwnProperty(name)){

                assign(result , config[name]) ;
            }

            return freeze(result) ;
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