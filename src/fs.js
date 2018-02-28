const {
    readFileSync,
    readdirSync,
    writeFileSync,
    mkdirSync
} = require('fs'),
{
    directory:is_directory
} =  require('./is'),
{
    join,
    dirname
} = require('path');

exports.readTextFile = path =>{

    try{

        return readFileSync(path , 'utf8') ;
    
    }catch(err){
    }

    return '' ;
} ;


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

function writeTextFile(path , data){

    create_directory(dirname(path)) ;

    writeFileSync(path , data) ;
}

exports.writeTextFile = writeTextFile ;

exports.writeJSONFile = (path , data , isFormat = true) =>{

    if(isFormat){

        data = JSON.stringify(data , null , 2) ;
    
    }else{

        data = JSON.stringify(data) ;
    }

    writeTextFile(path , data) ;
}

function getFilePaths(path){

    let names = readdirSync(path),
        paths = [];

    for(let name of names){

        let childPath = join(path , name) ;

        if(is_directory(childPath)){

            paths.push(...getFilePaths(childPath)) ;
        
        }else{

            paths.push(childPath) ;
        }
    }

    return paths ;
}

exports.getAllFilePaths = path =>{

    if(is_directory(path)){

        return getFilePaths(path) ;
    }

    return [] ;
}