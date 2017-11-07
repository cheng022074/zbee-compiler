const {
    file:is_file
} = require('./is'),
{
    extname,
    join
} = require('path'),
{
    transform,
    transformFileSync
} = require('babel-core'),
BABEL_PRESET_ENV = require('babel-preset-env'),
useStrictRe = /^[\'\"]use\sstrict[\'\"];/;

function process_compile_result({
    code
}){

    return code.replace(useStrictRe , '') ;
}

exports.compile = data =>{

    return process_compile_result(transform(data , {
        presets: [
            BABEL_PRESET_ENV
        ]
    })) ;
}

exports.compilePath = path =>{

    return process_compile_result(transformFileSync(path , {
        presets: [
            BABEL_PRESET_ENV
        ]
    })) ;
}