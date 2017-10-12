exports.TEST = 'test' ;

exports.DEVELOPMENT = 'dev' ;

exports.DEMO = 'demo' ;

exports.FORMAL = 'formal' ;

let environment = exports.FORMAL;

const configs = {} ;

exports.set = env =>{

    let uris = Object.keys(configs) ;

    for(let uri of uris){

        delete configs[uri] ;
    }

    environment = env ;
}

exports.get = () =>{

    return environment ;
}

const {
    readJSONFile
} = require('./fs'),
PATH = require('./path'),
{
    deepApply:object_apply
} = require('./object');

exports.getConfig = (path , isCache = true) =>{

    path = PATH.replaceSuffix(path , '') ;

    if(isCache === false){

        delete configs[path] ;
    }

    if(configs.hasOwnProperty(path)){

        return configs[path] ;
    }

    let config = {} ;
    
    object_apply(config , getConfig(`${path}.json`)) ;

    object_apply(config , getConfig(`${path}@${environment}.json`)) ;

    configs[path] = config ;

    return config ;
}

function getConfig(path){

    return readJSONFile(path) || {} ;
}