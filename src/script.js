const {
    js
} = require('js-beautify'),
{
    min
} = require('jsmin');

exports.format = code =>{

    try{

        return js(code) ;

    }catch(err){


    }

    return code ;
}

exports.min = code =>{

    try{

        return min(code) ;

    }catch(err){


    }
}