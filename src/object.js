{
    const {
        defineProperty    
    } = Object,
    {
        capitalize
    } = require('./string'),
    {
        function:is_function
    } = require('./is'),
    {
        unique,
        from
    } = require('./array'),
    prefix = `$private_${Date.now()}_`;
    
    function defineCacheProperty(target , name){
    
        defineProperty(target , name , {

            enumerable:true,
    
            set(value){
    
                let me = this,
                    methodName = `apply${capitalize(name)}`;
    
                if(methodName in me){
    
                    me[`${prefix}${name}`] = me[methodName](value) ;
                }
            },
    
            get(){
    
                let me = this,
                    innerName = `${prefix}${name}`,
                    method = me[`apply${capitalize(name)}`];
    
                if(!me.hasOwnProperty(innerName) && method){
    
                    if(is_function(method) && method.length === 0){
    
                        return me[innerName] = method.call(me) ;
                    }
                }
    
                return me[innerName] ;
            }
    
        }) ;
    }
    
    exports.defineCacheProperty = defineCacheProperty ;
    
    exports.defineCacheProperties = (target , names) =>{

        names = unique(names) ;
    
        for(let name of names){
    
            defineCacheProperty(target , name) ;
        }
    }

    exports.clearCacheProperties = (target , names) =>{

        names = from(names) ;

        for(let name of names){

            let innerName = `${prefix}${name}` ;

            if(target.hasOwnProperty(innerName)){

                delete target[innerName] ;
            }
        }
    }
}

{
    const splitRe = /\./;
    
    exports.get = (data , key) =>{
    
        if(key){
    
            if(data.hasOwnProperty(key)){
    
                return data[key] ;
            }
    
            let names = key.split(splitRe),
                prefix = '';

            for(let name of names){

                let key = `${prefix}${name}` ;

                if(data.hasOwnProperty(key)){

                    data = data[key] ;

                    prefix = '' ;
                
                }else{

                    prefix = `${key}.` ;
                }
            }

            if(prefix){

                return ;
            }
    
            return data ;
        }
    
        return data ;
    }

    exports.has = (data , key) =>{

        if(data.hasOwnProperty(key)){
    
            return data[key] ;
        }

        let names = key.split(splitRe),
            prefix = '';

        for(let name of names){

            let key = `${prefix}${name}` ;

            if(data.hasOwnProperty(key)){

                prefix = '' ;
            
            }else{

                prefix = `${key}.` ;
            }
        }

        return !!prefix ;
    }
}