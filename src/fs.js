const {
    dirname,
    sep,
    join
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
} = require('elementtree'),
{
    basename
} = require('./path'),
{
    parse:html_parse
} = require('./html');

exports.searchFilePath = (path , suffix) =>{

    path = join(dirname(path) , basename(path , suffix)) ;

    if(is_file(path)){

        return path ;
    }
}


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

exports.readTextFile = path =>{

    try{

        return readFileSync(path , 'utf8') ;
    
    }catch(err){

    }
}

exports.readJSONFile = path =>{

    let data = exports.readTextFile(path) ;

    if(data){

        try{

            return JSON.parse(require('strip-comment').js(data)) ;

        }catch(err){
        }
    }
}

exports.readXMLFile = path =>{

    let data = exports.readTextFile(path) ;
    
    if(data){

        return xml_parse(data) ;
    }
}

exports.readHTMLFile = path =>{

    let data = exports.readTextFile(path) ;

    if(data){

        return html_parse(data);
    }
}