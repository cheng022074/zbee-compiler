const {
    get
} = require('../../script'),
application = require('../../application'),
{
    encode
} = require('../../object/key'),
get_source_codes = require('./get'),
{
    NotDefinedException
} = require('../../exception'),
{
    from,
    remove
} = require('../../array'),
dotRe = /\./g,
lastMatchRe = /\*$/;

function generateRegExes(names){

    let result = [] ;

    for(let name of names){

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
                to
            } = config,
            me = this;

            me.sourceCodes = get_source_codes(this.includeRegExes = generateRegExes(from(includes))) ;
            
            me.exists = true ;

            me.toName = to ;

            me.config = config ;
        
        }else{

            me.exists = false ;
        }
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

            return application.executeBinCode(`code.package.${toName}` , result.join('\n') , me) ;
        
        }else{

            throw new NotDefinedException('打包器' , name , `打包方式未定义`) ;
        }

        return false ;
    }
}

module.exports = Packager ;