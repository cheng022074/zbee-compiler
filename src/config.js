const {
    get:object_get
} = require('./object'),
{
    simpleObject:is_object
} = require('./is'),
{
    BinCode
} = require('./code'),
CONFIGS = {};

function get(name , key){

    if(!CONFIGS.hasOwnProperty(name)){

        CONFIGS[name] = Object.freeze(BinCode.get(`config::${name}`).target || {}) ;
    }

    return object_get(CONFIGS[name] , key) ;
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