const {
    function:is_function,
    object:is_object,
    class:is_class
} = require('./is') ;

exports.run = (target , ...args) =>{

    if(is_function(target)){

        return target(...args) ;
    
    }else if(is_class(target) || is_object(target)){

        return target.main(...args) ;
    }
}