const {
    defineProperties
} = require('../object'),
{
    join,
    sep
} = require('path'),
{
    file:is_file
} = require('../is');

module.exports = target =>{

    defineProperties(target , {

        SCOPE_PATHS:{

            once:true,

            get:() =>{

                let folders = target.SCOPE_FOLDERS,
                    scopes = Object.keys(folders),
                    rootPath = target.PATH,
                    paths = {};

                for(let scope of scopes){

                    paths[scope] = join(rootPath , folders[scope]) ;
                }

                return paths ;
            }
        }
    }) ;

    const codeNameRe = /^(?:(\w+)\:{2})?(\w+(?:\.\w+)*)$/ ;

    target.parseSourceCodeName = (codeName , suffix) =>{

        let match = codeName.match(codeNameRe),
            scopeSuffixes = target.SCOPE_SUFFIXES;

        if(match){

            let scopePaths = target.SCOPE_PATHS,
                scope = match[1] || target.DEFAULT_SCOPE,
                name = match[2];

            if(scopePaths.hasOwnProperty(scope)){

                let basePath = join(scopePaths[scope] , name.replace(/\./g , sep)) ;

                if(suffix){
                    
                    let path = `${basePath}${suffix}` ;

                    if(is_file(path)){

                        return {
                            path,
                            name,
                            scope,
                            suffix
                        } ;
                    }
    
                }else if(scopeSuffixes.hasOwnProperty(scope)){
    
                    let suffixes = scopeSuffixes[scope];

                    for(let suffix of suffixes){
    
                        let path = `${basePath}${suffix}` ;
    
                        if(!is_file(path)){
    
                            continue ;
                        }
    
                        return {
                            path,
                            name,
                            scope,
                            suffix
                        } ;
                    }
                }
            }
        }
    }
}