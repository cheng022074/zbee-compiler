const {
    get:properties_get
} = require('../src/properties'),
{
    join:path_join
} = require('path'),
{
    name2path,
    getFilePaths,
} = require('../src/path'),
{
    from:array_from,
    flat:array_flat,
    unique:array_unique
} = require('../src/array'),
{
    importNames
} = require('../src/script');

module.exports = (name = 'default') =>{

    let config = properties_get(`package.${name}`) ;

    if(config){

        let importNames = array_from(config.imports),
            paths = [],
            bootPath = properties_get('compile.path.source');

        for(let importName of importNames){

            paths.push(getFilePaths(path_join(bootPath , name2path(importName)))) ;
        }

        paths = array_unique(array_flat(paths)) ;

        let extraImportNames = [] ;

        for(let path of paths){

            let names = importNames(path) ;

            for(let name of names){

                if(!importNames.includes(name) && !extraImportNames.includes(name)){

                    extraImportNames.push(name) ;
                }
            }
        }

        for(let importName of extraImportNames){

            paths.push(getFilePaths(importName)) ;
        }

        paths = array_unique(array_flat(paths)) ;

        console.log(paths) ;

    }else{

        console.error(name , '不是一个有效的打包配置') ;
    }
}