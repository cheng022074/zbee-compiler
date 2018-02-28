const {
    DOMParser
} = require('xmldom'),
{
    readTextFile
} = require('./fs'),
doc = new DOMParser();

function parse(data){

    try{

        return doc.parseFromString(data , 'text/xml') ;

    }catch(err){


    }

    return doc.parseFromString('<xml/>' , 'text/xml') ;
}

exports.load = path =>{

    return parse(readTextFile(path)) ;
}