const {
    readJSONFile
} = require('./fs'),
{
    join:path_join
} = require('path'),
{
    get:object_get
} = require('./object'),
{
    defined:is_defined
} = require('./is'),
config = readJSONFile(path_join(process.cwd() , 'properties.json')) || {},
defaultKeys = {
    'compile.path.source':'src',
    'compile.path.dist':'bin',
    'run.path.bin':'bin'
};

exports.get = key =>{

    let value = object_get(config , key) ;

    if(is_defined(value)){

        return value ;
    }

    if(defaultKeys.hasOwnProperty(key)){

        return defaultKeys[key] ;
    }
}