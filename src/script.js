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
    parse
} = require('@babel/parser'),
{
    default:traverse
} = require('@babel/traverse'),
{
    default:generate
} = require('@babel/generator'),
{
    transformSync
} = require('@babel/core');

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

exports.parse = code =>{

    try{

        return parse(code , {
            allowReturnOutsideFunction:true,
            allowAwaitOutsideFunction:true
        }) ;

    }catch(err){

        throw `代码存在问题: \n ${code}` ;
    }

   

}

exports.traverse = (ast , config) =>{
    
    try{

        traverse(ast , config) ;

    }catch(err){


    }
}

exports.compile = (code , transform = true) =>{

    let plugins = [],
        transformRuntimePlugin = require('@babel/plugin-transform-runtime');

    if(transform){

        plugins.push([
            transformRuntimePlugin,
            {
                corejs:3
            }
        ]) ;
    }

    return transformSync(code , {
        presets:[
            require('@babel/preset-env')
        ],
        plugins
    }).code ;
}

exports.stringify = ast =>{

    return generate(ast) ;
}