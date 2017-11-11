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

        let me = this ;

        me.sourceCodes = get_source_codes(names) ;

        me.application = application ;
    }

    get isEmpty(){

        return this.sourceCodes.length === 0 ;
    }

    compile(){

        let result = [] ;

        for(let sourceCode of this.sourceCodes){

            let suffix = encode(sourceCode.suffix),
                scope = sourceCode.scope,
                fromName = `code.${application.get(`compile.${scope}.${suffix}.from`)}`,
                toName = `code.compile.${application.get(`compile.${scope}.${suffix}.to`)}` ;

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