const {
    get
} = require('../../script'),
application = require('../../application'),
{
    encode
} = require('../../object/key'),
get_source_codes = require('./get'),
{
    TargetKeyException
} = require('../../exception'),
{
    from,
    remove
} = require('../../array'),
dotRe = /\./g,
lastMatchRe = /\*$/,
application_watch = require('./watch'),
DEFAULT_SCOPE = application.DEFAULT_SCOPE,
prefixRe = /^\w+\:{2}/;

function generate_regexes(names){

    let result = [] ;

    for(let name of names){

        if(!prefixRe.test(name)){

            name = `${DEFAULT_SCOPE}::${name}` ;
        }

        result.push(new RegExp(`^${name.replace(dotRe , '\\\.').replace(lastMatchRe , '.+')}$`)) ;
    }

    return result ;
}

class Packager{

    constructor(name){

        let config = application.get(`package.${name}`),
            me = this;

        me.name = name ;

        me.application = application ;

        me.sourceCodes = [] ;

        if(config){

            let {
                includes,
                to,
                watch
            } = config;

            includes = from(includes) ;

            me.sourceCodes = get_source_codes(includes) ;

            me.includeRegExes = generate_regexes(includes) ;
            
            me.exists = true ;

            me.toName = to ;

            me.config = config ;

            me.watchScopes = watch ;
    
        }else{

            me.exists = false ;
        }

        me.packaged = false ;
    }

    watch(fn){

        let me = this,
            scopes = me.watchScopes ;

        if(scopes){

            application_watch(scopes , (type , name) =>{

                switch(type){

                    case 'create':
                    case 'update':

                        me.add(name) ;

                        break ;

                    case 'remove':

                        me.remove(name) ;
                }

                fn(me.package()) ;

            }) ;

            return true ;
        }

        return false ;
    }

    add(name){

        let me = this,
            includeRegExes = me.includeRegExes,
            sourceCodes = me.sourceCodes;

        for(let includeRegEx of includeRegExes){

            if(includeRegEx.test(name)){

                let code = application.getSourceCode(name) ;

                if(code){

                    if(!sourceCodes.includes(code)){

                        sourceCodes.push(code) ;

                        let codes = code.importAllSourceCodes ;
                        
                        for(let code of codes){

                            if(!sourceCodes.includes(code)){
        
                                sourceCodes.push(code) ;
                            }
                        }

                    }else{

                        code.sync() ;
                    }

                    me.packaged = false ;

                    return true ;
                }
            }
        }

        return false ;
    }

    remove(name){

        let me = this;
        
        return remove(me.sourceCodes , me.application.getSourceCode(name)) ;
    }

    package(){

        let me = this ;

        if(!me.exists){

            return false;
        }

        if(me.packaged){

            return false ;
        }

        let result = [],
            name = me.name,
            toName = me.toName;

        if(toName){

            let codes = me.sourceCodes ;

            for(let sourceCode of codes){

                if(!sourceCode.code){

                    continue ;
                }
                
                let suffix = encode(sourceCode.suffix),
                    scope = sourceCode.scope,
                    fromName = application.get(`package.${name}.scope.${scope}.${suffix}`);
    
                if(fromName){
            
                    let codeStr = application.executeBinCode(`code.${fromName}` , sourceCode , 'package') ;
            
                    if(codeStr){

                        result.push(codeStr) ;
                    }
                }
            }

            me.packaged = true ;

            return application.executeBinCode(`code.package.${toName}` , result.join('\n') , me) ;
        
        }else{

            throw new TargetKeyException('打包器' , name , `打包方式未定义`) ;
        }

        return false ;
    }
}

module.exports = Packager ;