const {
    function:is_function
} = require('../is');

exports.params = fn =>{

    if(is_function(fn)){

        let paramRe = /\(\s*(\w+)|(\w+)\s*\,|(\w+)\s*\=|(\w+)\s*\)/g,
            match,
            data = fn.toString(),
            params = [];

        while(match = paramRe.exec(data)){

            params.push(match[1]) ;
        }

        return params ;
    }

    return [] ;
}