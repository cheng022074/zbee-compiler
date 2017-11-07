const {
    get
} = require('../../script'),
application = require('../../application'),
{
    encode
} = require('../../object/key'),
get_source_codes = require('./get');

class Packager{

    constructor(name){

        let config = application.get(`package.${name}`),
            me = this;

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
                
                let suffix = encode(sourceCode.suffix),
                    scope = sourceCode.scope,
                    fromName = application.get(`package.${name}.scope.${scope}.${suffix}`);
    
                if(fromName){
            
                    let codeStr = application.executeBinCode(fromName , sourceCode) ;
            
                    if(codeStr){

                        result.push(codeStr) ;
                    }
                }
            }

            return application.executeBinCode(toName , result.join('\n') , me) ;
        }

        return false ;
    }
}

module.exports = Packager ;