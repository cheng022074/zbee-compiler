const {
    join:path_join
} = require('path'),
{
    name2path
} = require('./path'),
{
    get:object_get
} = require('./object'),
{
    defined:is_defined
} = require('./is'),
{
    getConfig:get_config
} = require('./environment');

exports.get = (name , key , isCache) =>{

    let config = get_config(path_join(__dirname , '..' , 'config' , name2path(name)) , isCache) ;
    
    if(is_defined(key)){

        return object_get(config , key) ;
    }

    return Object.keys(config) ;
}