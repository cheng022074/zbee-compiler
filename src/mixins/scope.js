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

    target.parseSourceCodeName = (codeName , validExists = true) =>{

        let match = codeName.match(codeNameRe),
            scopeSuffixes = target.SCOPE_SUFFIXES;

        if(match){

            let scopePaths = target.SCOPE_PATHS,
                scope = match[1] || target.DEFAULT_SCOPE,
                name = match[2];

            if(scope && scopePaths.hasOwnProperty(scope) && scopeSuffixes.hasOwnProperty(scope)){

                let suffixes = scopeSuffixes[scope],
                    basePath = join(scopePaths[scope] , name.replace(/\./g , sep)) ;

                for(let suffix of suffixes){

                    let path = `${basePath}${suffix}` ;

                    if(validExists && !is_file(path)){

                        return ;
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