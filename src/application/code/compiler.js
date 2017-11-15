const {
    get
} = require('../../script'),
{
    encode
} = require('../../object/key'),
application = require('../../application'),
get_source_codes = require('./get'),
{
    from
} = require('../../array');

class Compiler{

    constructor(names){

        names = from(names) ;

        let me = this ;

        me.sourceCodes = get_source_codes(names) ;

        me.application = application ;
    }

    compile(fn = () =>{}){

        let result = [] ;

        for(let sourceCode of this.sourceCodes){

            if(!sourceCode.code){

                continue ;
            }

            let suffix = encode(sourceCode.suffix),
                scope = sourceCode.scope,
                fromName = application.get(`compile.scope.${scope}.${suffix}.from`),
                toName = application.get(`compile.scope.${scope}.${suffix}.to`) ;

            if(fromName && toName){

                let codeStr = application.executeBinCode(`code.${fromName}` , sourceCode , 'compile') ;

                if(codeStr){

                    let path = application.executeBinCode(`code.compile.${toName}` , codeStr , sourceCode) ;

                    if(path){

                        fn(path) ;

                        result.push(path) ;
                    }
                }
            }
        }

        return result ;
    }
}

module.exports = Compiler ;