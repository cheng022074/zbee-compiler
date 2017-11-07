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

class Compiler{

    constructor(names){

        this.name = name ;


    }

    compile(){


    }
}

function get_source_codes(names){

    names = from(names) ;

    let codes = [] ;
    
    for(let name of names){

        let configs = application.parseSourceCodeNames(name) ;

        for(let config of configs){

            let code = application.getSourceCode(config);

            codes.push(...code.importAllSourceCodes) ;

            codes.push(code) ;
        }
    }

    return unique(codes);
}

module.exports = Compiler ;