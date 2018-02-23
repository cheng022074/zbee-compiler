{
    const {
        defineProperty    
    } = Object,
    {
        capitalize
    } = require('./string'),
    {
        function:is_function
    } = require('./is');
    
    function defineCacheProperty(target , name){
    
        defineProperty(target , name , {
    
            set(value){
    
                let me = this,
                    methodName = `apply${capitalize(name)}`;
    
                if(methodName in me){
    
                    me[`$${name}`] = me[methodName](value) ;
                }
            },
    
            get(){
    
                let me = this,
                    innerName = `$${name}`,
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
    
        for(let name of names){
    
            defineCacheProperty(target , name) ;
        }
    }
}

exports.get = (data , key) =>{

    if(key){

        return data[key] ;
    }

    return data ;
}