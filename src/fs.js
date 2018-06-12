const {
    readFileSync,
    readdirSync,
    writeFileSync,
    copyFileSync,
    mkdirSync,
    statSync,
    unlinkSync,
    renameSync
} = require('fs'),
{
    directory:is_directory,
    file:is_file,
} =  require('./is'),
{
    join,
    dirname,
    basename
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

function getAllFilePaths(path){

    if(is_directory(path)){

        return getFilePaths(path) ;
    }

    return [] ;
}

exports.getAllFilePaths = getAllFilePaths ;

exports.getMotifyTime = path =>{

    if(is_file(path)){

        return statSync(path).mtime.getTime() ;
    }

    return -1 ;
}

exports.copyAllFiles = (src , dest) =>{

    if(is_directory(src)){

        return copyAllFiles(src , dest) ;
    }

    return false ;
}

function copyAllFiles(src , dest){

    let paths = getAllFilePaths(src),
        destPaths = [];

    for(let path of paths){

        let destPath = path.replace(dirname(src) , dest) ;

        create_directory(dirname(destPath)) ;

        copyFileSync(path , destPath) ;

        destPaths.push(destPath) ;
    }

    return destPaths ;
}

exports.copyFile = (src , dest) =>{

    if(is_file(src)){

        return copyFile(src , dest) ;
    }

    return false ;
}

function copyFile(src , dest){

    let destPath = join(dest , basename(src)) ;

    create_directory(dirname(destPath)) ;

    copyFileSync(src , destPath) ;

    return destPath ;
}

exports.copy = (src , dest) =>{

    if(is_file(src)){

        return copyFile(src , dest) ;
    
    }else if(is_directory(src)){

        return copyAllFiles(src , dest) ;
    }

    return false ;
}

exports.remove = path =>{

    if(is_file(path)){

        unlinkSync(path) ;
    }
}

exports.rename = (path , newName) =>{

    if(is_file(path)){

        renameSync(path , join(dirname(path) , newName)) ;
    }
}