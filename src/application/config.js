const {
    get:object_get
} = require('../object'),
{
    string:is_string,
    simpleObject:is_simple_object
} = require('../is'),
{
    ConfigNotFoundException
} = require('../application/exception');

function get(application , name , key){

    let code = application.getBinCode(`config::${name}`) ;

    if(code && code.isFile){

        let config = code.caller ;

        if(is_string(key)){

            return object_get(config , key) ;
        }

        return config ;
    
    }else{

        throw new ConfigNotFoundException(name) ;
    }
}

const configRe = /^([^\:]+)\:{2}([^\:]+)$/ ;

class Config{

    constructor(application){

        this.application = application ;
    }

    get(name , key){

        let application = this.application,
            match = name.match(configRe);

        if(match){

            return get(application , match[1].trim() , match[2].trim()) ;
        }

        return get(application , name , key) ;
    }

    keys(name , key){

        let config = this.get(name , key) ;
        
        if(is_simple_object(config)){
    
            return Object.keys(config) ;
        }
    
        return [] ;
    }
}

module.exports = Config ;