const {
    readJSONFile
} = require('./fs'),
{
    join:path_join
} = require('path'),
PATH = require('./path'),
{
    get:object_get
} = require('./object'),
{
    defined:is_defined
} = require('./is'),
{
    getConfig:get_config
} = require('./environment');

let defaultConfig;

exports.get = key =>{

    config = get_config(PATH.getApplicationPath('properties')) ;

    let value = object_get(config , key) ;

    if(is_defined(value)){

        return value ;
    }

    if(!defaultConfig){

        defaultConfig = readJSONFile(PATH.getCompilerPath('properties.json')) ;
    }

    return object_get(defaultConfig , key) ;
}

exports.getScopeName = key =>{

    if(!require('./path').applicationScopeExists(name)){

        throw new Error(`属性文件::${key} 指定不是一个有效的作用域`) ;
    }
}