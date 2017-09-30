const {
    join:path_join
} = require('path'),
{
    name2path
} = require('./path'),
{
    readJSONFile
} = require('./fs'),
{
    get:object_get
} = require('./object'),
{
    defined:is_defined
} = require('./is');

const cache = {} ;

exports.get = (name , key , isCache = true) =>{

    if(isCache === false){

        delete cache[name] ;
    }

    if(!cache.hasOwnProperty(name)){

        cache[name] = readJSONFile(path_join(__dirname , '..' , 'config' , name2path(name , '.json')));
    }

    let config = cache[name] ;
    
    if(config){

        if(is_defined(key)){

            return object_get(config , key) ;
        }

        return Object.keys(config) ;
    }
}