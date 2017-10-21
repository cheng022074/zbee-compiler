const {
    defineProperties
} = require('../object'),
{
    join,
    sep
} = require('path'),
{
    file:is_file
} = require('fs');

module.exports = target =>{

    defineProperties(target , {

        SCOPE_PATHS:{

            once:true,

            get:() =>{

                let folders = exports.SCOPE_FOLDERS,
                    scopes = Object.keys(folders),
                    rootPath = exports.PATH,
                    paths = {};

                for(let scope of scopes){

                    paths[scope] = join(rootPath , folders[scope]) ;
                }

                return paths ;
            }
        }
    }) ;

    const codeNameRe = /^(?:(\w+)\:{2})?(\w+(?:\.\w+)*)$/ ;

    target.parseSourceCodeName = codeName =>{

        let match = codeName.match(codeNameRe) ;

        if(match){

            let scopePaths = target.SCOPE_PATHS,
                scope = match[1] || target.DEFAULT_SCOPE,
                name = match[2];

            if(scope && scopePaths.hasOwnProperty(scope)){

                let suffixes = target.SCOPE_SUFFIXES,
                    basePath = join(scopePaths[scope] , name.replace(/\./g , sep)) ;

                for(let suffix of suffixes){

                    let path = `${basePath}${suffix}` ;

                    if(is_file(path)){

                        return {
                            path,
                            name,
                            scope
                        } ;
                    }
                }
            }
        }
    }
}