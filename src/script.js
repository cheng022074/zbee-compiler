const {
    js
} = require('js-beautify'),
{
    jsmin
} = require('jsmin'),
{
    js:stripComment
} = require('strip-comment');

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

exports.stripComment = code =>{

    return stripComment(code) ;
}