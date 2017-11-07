const {
    defineProperty
} = require('./object'),
{
    join,
    sep
} = require('path'),
{
    file:is_file,
    directory:is_directory
} = require('./is'),
{
    readCodeNames
} = require('./fs'),
codeNameRe = /^(?:(\w+)\:{2})?((?:\w+(?:\.\w+)*(?:\.\*)?)|\*)$/,
codeFileNameRe = /^(?:(\w+)\:{2})?(\w+(?:\.\w+)*)$/,
suffixCodeNameRe = /\.?\*$/;

class Project{

    constructor(){

        let me = this ;

        me.$binCodes = {} ;
        
        me.$sourceCodes = {} ;
    }

    parseSourceCodeNames(codeName){
    
        let match = codeName.match(codeFileNameRe),
            me = this;
    
        if(match){
    
            return [
                me.parseSourceCodeName(codeName)
            ] ;
    
        }else{
    
            let match = codeName.match(codeNameRe) ;
    
            if(match){
    
                let me = this,
                    scopeSuffixes = me.SCOPE_SUFFIXES,
                    scopePaths = me.SCOPE_PATHS,
                    scope = match[1] || me.DEFAULT_SCOPE,
                    name = match[2].replace(suffixCodeNameRe , '');
    
                if(scopePaths.hasOwnProperty(scope)){
                    
                    let basePath = join(scopePaths[scope] , name.replace(/\./g , sep)) ;
    
                    if(is_directory(basePath) && scopeSuffixes.hasOwnProperty(scope)){
    
                        let names = readCodeNames(basePath , scopeSuffixes[scope]),
                            result = [];
    
                        for(let name of names){
    
                            let config = me.parseSourceCodeName(`${scope}::${name}`) ;
    
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

    parseSourceCodeName(codeName , suffix){
        
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

    static getCode(project , name , storageKey , generateMethodName){
    
        let codes = project[`$${storageKey}`];

        if(!codes.hasOwnProperty(name) && generateMethodName in project){

            let code = project[generateMethodName](name) ;
    
            if(code){
    
                codes[code.fullName] = code ;
                
                codes[name] = code ;
            }
        }
    
        return codes[name] ;
    }

    getBinCode(name){

        return Project.getCode(this , name , 'binCodes' , 'generateBinCode') ;
    }
        
    getSourceCode(name){
    
        return Project.getCode(this , name , 'sourceCodes' , 'generateSourceCode') ;
    }
}

defineProperty(Project.prototype , 'SCOPE_PATHS' , {

    get(){

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
}) ;

module.exports = Project ;