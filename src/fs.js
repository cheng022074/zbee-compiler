const {
    readFileSync,
    readdirSync,
    writeFileSync,
    copyFileSync,
    mkdirSync,
    statSync,
    unlinkSync,
    renameSync,
    rmdirSync
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

function readTextFile(path){

    try{

        return readFileSync(path , 'utf8') ;
    
    }catch(err){
    }

    return '' ;
} ;

exports.readTextFile = readTextFile ;

exports.readFile = path =>{

    try{

        return readFileSync(path) ;

    }catch(err){


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

function writeTextFile(path , data){

    create_directory(dirname(path)) ;

    writeFileSync(path , data) ;
}

exports.writeTextFile = writeTextFile ;

exports.writeFile = writeTextFile ;

exports.writeJSONFile = (path , data , isFormat = true) =>{

    if(isFormat){

        data = JSON.stringify(data , null , 2) ;
    
    }else{

        data = JSON.stringify(data) ;
    }

    writeTextFile(path , data) ;
}

exports.readJSONFile = path =>{

    try{

        return JSON.parse(readTextFile(path)) ;

    }catch(err){


    }

    return {} ;
}

function getFilePaths(path , regexp = /^.+$/){

    if(is_directory(path)){

        let names = readdirSync(path),
            paths = [];

        for(let name of names){

            let childPath = join(path , name) ;

            if(is_directory(childPath)){

                paths.push(...getFilePaths(childPath)) ;
            
            }else if(regexp.test(childPath)){

                paths.push(childPath) ;
            }
        }

        return paths ;
    }

    return [] ;
}

function getAllFilePaths(path , regexp){

    if(is_directory(path)){

        return getFilePaths(path , regexp) ;
    }

    return [] ;
}

exports.getAllFilePaths = getAllFilePaths ;

exports.getFilePaths = getFilePaths ;

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

function remove(path){

    if(is_file(path)){

        unlinkSync(path) ;
    
    }else if(is_directory(path)){

        let names = readdirSync(path),
            paths = [];

        for(let name of names){

            remove(join(path , name)) ;
        }

        rmdirSync(path) ;
    }
}

exports.remove = remove ;

exports.rename = (path , newName) =>{

    if(is_file(path)){

        let filePath = join(dirname(path) , newName) ;

        create_directory(dirname(filePath)) ;

        renameSync(path , filePath) ;
    }
}