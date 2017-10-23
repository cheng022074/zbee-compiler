const {
    js_beautify
} = require('js-beautify'),
{
    jsdom
} = require('jsdom'),
{
    string:is_string
} = require('./is');

exports.parse = data =>{

    return jsdom(data) ;
}

exports.stringify = data =>{

    
}

exports.format = data =>{

    try{
        
        return js_beautify(data) ;

    }catch(err){
    }

    return data ;
}