const {
    get
} = require('../../script'),
{
    encode
} = require('../../object/key'),
application = require('../../application'),
get_source_codes = require('./get');

class Compiler{

    constructor(names){

        this.sourceCodes = get_source_codes(names) ;
    }

    get isEmpty(){

        return this.sourceCodes.length === 0 ;
    }

    compile(){

        let result = [] ;

        for(let sourceCode of this.sourceCodes){

            let suffix = encode(sourceCode.suffix),
                scope = sourceCode.scope,
                fromName = application.get(`compile.${scope}.${suffix}.from`),
                toName = application.get(`compile.${scope}.${suffix}.to`) ;

            if(fromName && toName){

                let codeStr = application.executeBinCode(fromName , sourceCode) ;

                if(codeStr){

                    let path = application.executeBinCode(toName , codeStr , sourceCode) ;

                    if(path){

                        result.push(path) ;
                    }
                }
            }
        }

        return result ;
    }
}

module.exports = Compiler ;