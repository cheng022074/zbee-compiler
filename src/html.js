const {
    js_beautify
} = require('js-beautify'),
{
    JSDOM 
} = require('jsdom'),
{
    string:is_string
} = require('./is');

exports.parse = data =>{

    let dom = new JSDOM(data) ;

    return dom.window.document ;
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