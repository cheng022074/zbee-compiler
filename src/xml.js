const {
    DOMParser,
    XMLSerializer
} = require('xmldom'),
{
    readTextFile
} = require('./fs'),
{
    select,
    select1
} = require('xpath'),
parser = new DOMParser(),
serializer = new XMLSerializer();

function parse(data){

    try{

        return parser.parseFromString(data , 'text/xml') ;

    }catch(err){


    }

    return doc.parseFromString('<xml/>' , 'text/xml') ;
}

exports.parse = parse ;

exports.stringify = node =>{

    try{

        return serializer.serializeToString(node) ;
    
    }catch(err){


    }

    return '<xml/>' ;
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