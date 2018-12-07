const {
    js
} = require('js-beautify'),
{
    jsmin
} = require('jsmin'),
{
    js:stripComment
} = require('strip-comment'),
{
    isAbsolute
} = require('path'),
{
    parseScript
} = require('esprima');

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

exports.include = path =>{

    if(isAbsolute(path)){

        let target = require(path) ;

        delete require.cache[path] ;

        return target ;
    }
}

exports.ast = code =>{

    return parseScript(code) ;

}