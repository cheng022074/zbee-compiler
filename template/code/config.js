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
    {
        env
    } = process,
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

        return freeze(target) ; 
    }

    return (name , key) =>{

        if(config.hasOwnProperty(name)){

            return get_config(config[name] , key) ;
        }

        try{

            return get_config(include(`config::${name}`) , key) ;

        }catch(err){

            <%
                if(data.browser !== true){
            %>

            const {
                readFileSync
            } = require('fs') ;

            try{

                return get_config(JSON.parse(readFileSync(join(env['ZBEE-APPLICATION-ROOT-PATH'] , 'config' , `${name.replace(dotRe , '/')}.json`) , 'utf8'))) ;

            }catch(err){

            }

            <%
                }
            %>
        }

    }

})()