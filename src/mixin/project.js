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

function get_scope_paths(){

    let me = this,
        folders = me.SCOPE_FOLDERS,
        scopes = Object.keys(folders),
        rootPath = me.PATH,
        paths = {};

    for(let scope of scopes){

        paths[scope] = join(rootPath , folders[scope]) ;
    }

    return paths ;
}

const codeNameRe = /^(?:(\w+)\:{2})?((?:\w+(?:\.\w+)*(?:\.\*)?)|\*)$/,
      codeFileNameRe = /^(?:(\w+)\:{2})?(\w+(?:\.\w+)*)$/,
      suffixCodeNameRe = /\.?\*$/;

function parseSourceCodeNames(codeName){

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

            let me = this,
                scopePaths = me.SCOPE_PATHS,
                scope = match[1] || me.DEFAULT_SCOPE,
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

function parseSourceCodeName(codeName , suffix){

    let match = codeName.match(codeFileNameRe);

    if(match){

        let me = this,
            scopeSuffixes = me.SCOPE_SUFFIXES,
            scopePaths = me.SCOPE_PATHS,
            scope = match[1] || me.DEFAULT_SCOPE,
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

function getCode(name , storageKey , generateMethodName){

    let me = this,
        codes = me[`$${storageKey}`];

    if(!codes.hasOwnProperty(name) && me.hasOwnProperty(generateMethodName)){

        let code = me[generateMethodName](name) ;

        if(code){

            codes[code.fullName] = code ;
            
            codes[name] = code ;
        }
    }

    return codes[name] ;
}

function getBinCode(name){

    return getCode.call(this , name , 'binCodes' , 'generateBinCode') ;
}

function getSourceCode(name){

    return getCode.call(this , name , 'sourceCodes' , 'generateSourceCode') ;
}

module.exports = target =>{

    target.$binCodes = {} ;

    target.$sourceCodes = {} ;

    defineProperties(target , {

        SCOPE_PATHS:{

            once:true,

            get:get_scope_paths
        }
    }) ;

    target.parseSourceCodeNames = parseSourceCodeNames ;

    target.parseSourceCodeName = parseSourceCodeName ;

    target.getBinCode = getBinCode ;

    target.getSourceCode = getSourceCode ;
}