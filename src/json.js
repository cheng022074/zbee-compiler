const {
    simpleObject:is_simpleObject,
    array:is_array
} = require('./is') ;

exports.parse = data =>{

    return JSON.parse(data) ;
}

exports.format = data =>{

    if(is_array(data) || is_simpleObject(data)){

        return JSON.stringify(data , null , 2) ;

    }

    return data ;
}