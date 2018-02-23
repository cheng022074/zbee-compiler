const {
    get:object_get
} = require('./object'),
{
    simpleObject:is_object
} = require('./is'),
{
    BinCode
} = require('./code');

function get(name , key){

    return object_get(require(`../config/${name}`) , key) ;
}

exports.get = (name , key) =>{

    return get(name , key) ;
}

exports.keys = (name , key) =>{

    let config = get(name , key) ;

    if(is_object(config)){

        return Object.keys(config) ;
    }

    return [] ;
}