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
{
    freeze
} = require('./object'),
CONFIGS = {};

function get_config(name){

    if(!CONFIGS.hasOwnProperty(name)){

        CONFIGS[name] = Object.freeze(BinCode.get(`config::${name}`).targets) ;
    }

    return CONFIGS[name] ;
}

exports.get = function(name , key){

    let targets = get_config(name) ;

    for(let target of targets){

        let value = object_get(target , key) ;

        if(value !== undefined){

            return freeze(value) ;
        }
    }
} ;

exports.keys = (name , key) =>{

    let targets = get_config(name),
        keys = [];

    for(let target of targets){

        let value = object_get(target , key) ;

        if(is_object(value)){

            keys.push(...Object.keys(value)) ;
        }
    }

    return keys ;
}

exports.has = (name , key) =>{

    let targets = get_config(name),
        keys = [];

    for(let target of targets){

        let result = object_has(target , key) ;

        if(result){

            return true ;
        }
    }

    return false ;
}