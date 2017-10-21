const {
    defineProperties
} = require('../object'),
{
    join,
    sep
} = require('path');

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

    target.getSourceCodePath = codeName =>{

        let match = codeName.match(codeNameRe) ;

        if(match){

            let scopePaths = exports.SCOPE_PATHS,
                scope = match[1] || exports.DEFAULT_SCOPE,
                name = match[2];

            if(scope && scopePaths.hasOwnProperty(scope)){

                let path = join(scopePaths[scope] , name.replace(/\./g , sep)) ;
            }
        }
    }

    target.getBinCodePath = name =>{


    }

    target.getSourceCode = name =>{


    }

    target.getBinCode = name =>{


    }
}