const {
    get
} = require('../../script'),
{
    from,
    unique
} = require('../../array'),
application = require('../../application'),
{
    encode
} = require('../../object/key');

class Packager{

    constructor(name){

        let config = application.get(`package.${name}`) ;

        me.name = name ;

        me.sourceCodes = [] ;

        if(config){

            let {
                includes,
                to
            } = config,
            me = this;
    
            if(includes){
    
                me.sourceCodes = get_source_codes(includes) ;
            }

            me.exists = true ;

            me.toName = to ;
        
        }else{

            me.exists = false ;
        }
    }

    notify(name){


    }

    package(){

        if(!me.exists){

            return ;
        }

        let result = [],
            me = this,
            name = me.name,
            toName = me.toName;

        if(toName){

            let codes = me.sourceCodes ;

            for(let sourceCode of codes){
                
                let suffix = encode(sourceCode.suffix),
                    scope = sourceCode.scope,
                    fromName = application.get(`package.${name}.scope.${scope}.${suffix}`);
    
                if(fromName){
            
                    let codeStr = application.executeBinCode(fromName , code) ;
            
                    if(codeStr){

                        result.push(codeStr) ;
                    }
                }
            }
   
            return application.executeBinCode(toName , result.join('\n') , codes) ;
        }

        return false ;
    }
}

function get_source_codes(names){

    names = from(names) ;

    let codes = [] ;
    
    for(let name of names){

        let configs = application.parseSourceCodeNames(name) ;

        for(let config of configs){

            let code = application.getSourceCode(config);

            console.log(config.name , code.fullName) ;

            codes.push(...code.importAllSourceCodes) ;

            codes.push(code) ;
        }
    }

    return unique(codes);
}

module.exports = Packager ;