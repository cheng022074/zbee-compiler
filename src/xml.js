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

exports.selectSingleNode = (target , xpath) =>{


}

exports.selectNodes = (target , xpath) =>{

    return select(xpath , target) ; 
}