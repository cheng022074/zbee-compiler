const application = require('../application'),
{
    get:object_get
} = require('../object'),
{
    string:is_string,
    simpleObject:is_simple_object
} = require('../is'),
{
    ConfigNotFoundException
} = require('../application/exception');

function get(name , key){

    let config = application.getBinCode(`config::${name}`) ;

    if(config){

        if(is_string(key)){

            return object_get(config , key) ;
        }

        return config ;
    
    }else{

        throw new ConfigNotFoundException(name) ;
    }
}

exports.get = get ;

exports.keys = (name , key) =>{

    let config = get(name , key) ;

    if(is_simple_object(config)){

        return Object.keys(config) ;
    }

    return [] ;
}