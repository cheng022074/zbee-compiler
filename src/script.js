const {
    js
} = require('js-beautify'),
{
    jsmin
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

        return jsmin(code) ;

    }catch(err){


    }

    return code ;
}