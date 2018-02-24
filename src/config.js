const {
    get:object_get,
    has:object_has
} = require('./object'),
{
    simpleObject:is_object
} = require('./is'),
{
    BinCode
} = require('./code'),
CONFIGS = {};

function get_config(name){

    if(!CONFIGS.hasOwnProperty(name)){

        CONFIGS[name] = Object.freeze(BinCode.get(`config::${name}`).target || {}) ;
    }

    return CONFIGS[name] ;
}

function get(name , key){

    return object_get(get_config(name) , key) ;
}

exports.get = get ;

exports.keys = (name , key) =>{

    let config = get(name , key) ;

    if(is_object(config)){

        return Object.keys(config) ;
    }

    return [] ;
}

exports.has = (name , key) =>{

    return object_has(get_config(name) , key) ;
}