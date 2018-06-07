const {
    function:is_function,
    object:is_object,
    class:is_class
} = require('./is') ;

exports.run = async (target , ...args) =>{

    if(is_function(target)){

        return await target(...args) ;
    
    }else if((is_class(target) || is_object(target)) && 'main' in target){

        return await target.main(...args) ;
    }
}

exports.runAsync = (target , ...args) =>{

    if(is_function(target)){

        return target(...args) ;
    
    }else if((is_class(target) || is_object(target)) && 'main' in target){

        return target.main(...args) ;
    }
}