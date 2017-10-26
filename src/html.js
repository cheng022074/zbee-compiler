const {
    html
} = require('js-beautify'),
{
    JSDOM 
} = require('jsdom'),
{
    htmlDocument:is_html_document,
    htmlElement:is_html_element,
    string:is_string
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

        if(is_string(data)){

            return html(data) ;

        }else{

            return html(exports.stringify(data)) ;
        }

    }catch(err){
    }

    return data ;
}