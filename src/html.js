const {
    js_beautify
} = require('js-beautify'),
{
    JSDOM 
} = require('jsdom'),
{
    string:is_string,
    htmlDocument:is_html_document,
    htmlElement:is_html_element
} = require('./is');

exports.parse = data =>{

    let dom = new JSDOM(data) ;

    return dom.window.document ;
}

exports.stringify = data =>{

   if(is_html_document(data)){

        return data.documentElement.outerHTML ;
   
   }else if(is_html_element(data)){

        return data.outerHTML ;
   }
}

exports.format = data =>{

    try{
        
        return js_beautify(data) ;

    }catch(err){
    }

    return data ;
}