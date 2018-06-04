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

function CDATAs(node){

    let {
        childNodes
    } = node,
    result = [];

    childNodes = Array.from(childNodes) ;

    for(let childNode of childNodes){

        if(childNode.nodeType === 4){

            result.push(childNode) ;
        }
    }

    return result ;
}

exports.CDATAs = CDATAs ;

exports.CDATAValues = node =>{

    let nodes = CDATAs(node),
        result = [];

    for(let node of nodes){

        result.push(node.nodeValue) ;
    }

    return result ;
}