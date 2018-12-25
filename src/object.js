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
    prefix = `$private-${Date.now()}-`;
    
    function defineProperty2(target , name){
    
        defineProperty(target , name , {
            configurable:true,
            enumerable:true,
            set(value){
    
                let me = this,
                    methodName = `set${capitalize(name)}`;
    
                if(methodName in me){
    
                    me[`${prefix}${name}`] = me[methodName](value) ;
                }
            },
    
            get(){
    
                let me = this,
                    innerName = `${prefix}${name}`,
                    method = me[`get${capitalize(name)}`];
    
                if(!me.hasOwnProperty(innerName) && method){
    
                    if(is_function(method) && method.length === 0){
    
                        return me[innerName] = method.call(me) ;
                    }
                }
    
                return me[innerName] ;
            }
    
        }) ;
    }
    
    exports.defineProperty = defineProperty2 ;
    
    exports.defineProperties = (target , names) =>{

        names = unique(names) ;
    
        for(let name of names){
    
            defineProperty2(target , name) ;
        }
    }

    exports.resetProperties = (target , names) =>{

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

{
    const {
        isFrozen,
        freeze,
        keys
    } = Object,
    {
        object:isObject
    } = require('./is');
    
    function freeze2(data){

        if (isObject(data) && !isFrozen(data)){

            freeze(data);

            let names = keys(data) ;

            for(let name of names){

                freeze2(data[name]) ;
            }
        }

        return data;
    }

    exports.freeze = freeze2 ;
}