const {
    js
} = require('js-beautify'),
{
    jsmin
} = require('jsmin'),
{
    transform
} = require('babel-core'),
babelPresetEnv = require('babel-preset-env'),
babelPresetStage2 = require('babel-preset-stage-2');

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

exports.compile = code =>{

    return transform(code , {
        presets:[
            babelPresetEnv,
            babelPresetStage2
        ]
    }).code ;
}