const {
    DOMParser
} = require('xmldom'),
{
    readTextFile
} = require('./fs'),
{
    select,
    select1
} = require('xpath'),
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

exports.selectSingleNode = (node , xpath) =>{

    return select1(xpath , node) ;
}

exports.selectNodes = (node , xpath) =>{

    return select(xpath , node) ; 
}