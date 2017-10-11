const {
    dirname,
    sep
} = require('path'),
{
    directory:is_directory,
    file:is_file,
    empty:is_empty
} = require('./is'),
{
    readFileSync,
    writeFileSync,
    mkdirSync
} = require('fs'),
{
    parse:xml_parse
} = require('elementtree');

const folderRe = /(?:^\/)|(?:[^\/\\]+(?:[\/\\]|$))/g;

function create_directory(path){

    let folderNames = path.match(folderRe),
        folderPath = '';

    for(let folderName of folderNames){

        folderPath += folderName ;

        if(folderName !== '/' && !is_directory(folderPath)){

            mkdirSync(folderPath) ;
        }
    }
}

exports.writeTextFile = (path , data) =>{

    create_directory(dirname(path)) ;

    writeFileSync(path , data) ;
}

exports.readTextFile = (path , validExists = true) =>{

    if(validExists && !is_file(path)){

        return ;
    }

    return readFileSync(path , 'utf8') ;
}

exports.readJSONFile = (path , validExists) =>{

    let data = exports.readTextFile(path , validExists) ;

    if(data){

        try{

            return JSON.parse(require('strip-comment').js(data)) ;

        }catch(err){
        }
    }
}

exports.readXMLFile = (path , validExists) =>{

    let data = exports.readTextFile(path , validExists) ;
    
    if(data){

        try{

            return xml_parse(data) ;

        }catch(err){
        }
    }
}