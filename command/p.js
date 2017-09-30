const {
    get:properties_get
} = require('../src/properties'),
{
    join:path_join
} = require('path'),
{
    name2path,
    getFilePaths,
    COMPILE_SOURCE_PATH
} = require('../src/path'),
{
    from:array_from,
    unique:array_unique
} = require('../src/array'),
{
    importPaths
} = require('../src/script');

module.exports = (name = 'default') =>{

    let config = properties_get(`package.${name}`) ;

    if(config){

        let importNames = array_from(config.imports),
            scriptPaths = [];

        for(let importName of importNames){

            let paths = getFilePaths(path_join(COMPILE_SOURCE_PATH , name2path(importName))) ;

            for(let path of paths){

                scriptPaths.push(...importPaths(path)) ;

                scriptPaths.push(path) ;
            }
        }

        scriptPaths = array_unique(scriptPaths) ;

        console.log(scriptPaths) ;

    }else{

        console.error(name , '不是一个有效的打包配置') ;
    }
}