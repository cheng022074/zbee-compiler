const {
    empty:is_empty,
    object:is_object
} = require('./is') ;

exports.get = (data , key) =>{

    if(is_empty(key) || key === '.'){
    
        return data ;
    }

    if(data.hasOwnProperty(key)){

        return data[key] ;
    }
        
    let keys = key.split('.') ;
    
    key = keys[keys.length - 1] ;
    
    keys.pop() ;
    
    let value = data;
    
    for(let key of keys){
    
        value = value[key] ;
    
        if(!is_object(value)){
    
            return ;
        }
    
    }
    
    return value[key] ;
}