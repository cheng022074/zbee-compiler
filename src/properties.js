const {
    readJSONFile
} = require('./fs'),
{
    join:path_join
} = require('path'),
{
    get:object_get
} = require('./object'),
config = readJSONFile(path_join(process.cwd() , 'properties.json')) || {};

exports.get = key =>{

    return object_get(config , key) ;
}