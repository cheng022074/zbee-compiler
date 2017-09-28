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
} = require('./object');

const cache = {} ;

exports.get = (name , key , isRefresh = false) =>{

    if(isRefresh){

        delete cache[name] ;
    }

    if(!cache.hasOwnProperty(name)){

        cache[name] = readJSONFile(path_join(__dirname , '..' , 'config' , name2path(name , '.json')));
    }

    let config = cache[name] ;
    
    if(config){

        return object_get(config , key) ;
    }
}