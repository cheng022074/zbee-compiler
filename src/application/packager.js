const {
    get
} = require('../script'),
{
    from,
    unique
} = require('../array'),
application = require('../application');

class Packager{

    constructor({
        includes,
        excludes,
        folders
    }){

        this.sourceCodes = get_source_codes(includes) ;
    }

    notify(name){


    }

    package(){


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