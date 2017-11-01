const {
    defineProperties
} = require('../object'),
{
    join,
    sep
} = require('path'),
{
    file:is_file,
    directory:is_directory
} = require('../is'),
{
    readNames
} = require('../fs');

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

    const codeNameRe = /^(?:(\w+)\:{2})?((?:\w+(?:\.\w+)*(?:\.\*)?)|\*)$/,
          codeFileNameRe = /^(?:(\w+)\:{2})?(\w+(?:\.\w+)*)$/,
          suffixCodeNameRe = /\.?\*$/;

    target.parseSourceCodeNames = codeName =>{

        let match = codeName.match(codeFileNameRe) ;

        const {
            parseSourceCodeName
        } = target ;

        if(match){

            return [
                parseSourceCodeName(codeName)
            ] ;

        }else{

            let match = codeName.match(codeNameRe) ;

            if(match){

                let scopePaths = target.SCOPE_PATHS,
                    scope = match[1] || target.DEFAULT_SCOPE,
                    name = match[2].replace(suffixCodeNameRe , '');

                if(scopePaths.hasOwnProperty(scope)){
                    
                    let basePath = join(scopePaths[scope] , name.replace(/\./g , sep)) ;

                    if(is_directory(basePath)){

                        let names = readNames(basePath),
                            result = [];

                        for(let name of names){

                            let config = parseSourceCodeName(`${scope}::${name}`) ;

                            if(config){

                                result.push(config) ;
                            }
                        }

                        return result ;
                    }
                }
            }
        }

        return [] ;
    }

    target.parseSourceCodeName = (codeName , suffix) =>{

        let match = codeName.match(codeFileNameRe);

        if(match){

            let scopeSuffixes = target.SCOPE_SUFFIXES,
                scopePaths = target.SCOPE_PATHS,
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

                    }else{

                        return {
                            scope,
                            name,
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

                    return {
                        scope,
                        name
                    } ;
                }
            }
        }
    }
}