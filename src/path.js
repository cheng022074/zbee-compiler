const {
    defineCacheProperty
} = require('./object'),
{
    join
} = require('path');

exports.initApplicationPath = path =>{

    exports.APPLICATION = path ;

    exports.initApplicationPath = () => {} ;
}

exports.applyCOMPILER = () =>{

    return join(__dirname , '..') ;
}

defineCacheProperty(exports , 'COMPILER') ;

const suffixRe = /(?:\.[^\.\/\\]+)+$/;

exports.extname = path =>{

    let match = path.match(suffixRe) ;

    if(match){

        return match[0] ;
    }

    return '' ;
}