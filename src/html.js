const {
    JSDOM
} = require('jsdom'),
{
    html
} = require('js-beautify');

exports.parse = data =>{

    return new JSDOM(data) ;
}

exports.stringify = data =>{

    if('serialize' in data){

        return data.serialize() ;
    
    }else if('outerHTML' in data){

        return `<!DOCTYPE html>${data.outerHTML}` ;
    }
}

exports.format = data =>{

    return html(data) ;
}