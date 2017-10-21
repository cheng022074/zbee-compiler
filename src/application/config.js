const {
    parseSourceCodeName,
    getBinCode
} = require('../application'),
{
    get:object_get
} = require('../object'),
{
    string:is_string,
    simpleObject:is_simple_object
} = require('../is');

function get(name , key){

    let sourceCodeConfig = parseSourceCodeName(name , false) ;
    
    if(sourceCodeConfig){

        let {
            name
        } = sourceCodeConfig,
        config = getBinCode(`config::${name}`) ;

        if(config){
    
            if(is_string(key)){
    
                return object_get(config , key) ;
            }
    
            return config ;
        }
    }
}

exports.get = (name , key) =>{

    return get(name , key) ;
}

exports.keys = (name , key) =>{

    let config = get(name , key) ;

    if(is_simple_object(config)){

        return Object.keys(config) ;
    }

    return [] ;
}