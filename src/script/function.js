const {
    function:is_function
} = require('../is');

exports.params = fn =>{

    if(is_function(fn)){

        let paramRe = /\(\s*(\w+)|(\w+)\s*\,|(\w+)\s*\=|(\w+)\s*\)/g,
            match,
            data = fn.toString(),
            params = [],
            endRe = /\)$/,
            startRe = /^\(/,
            equalRe = /\=$/,
            commaRe = /\,$/;

        while(match = paramRe.exec(data)){

            let value = match[0] ;

            if(startRe.test(value)){

                params.push(match[1]) ;

            }else if(commaRe.test(value)){

                params.push(match[2]) ;

            }else if(equalRe.test(value)){

                params.push(match[3]) ;

            }else if(endRe.test(value)){

                params.push(match[4]) ; 

                break ;
            }
        }

        return params ;
    }

    return [] ;
}