const {
    readFileSync,
    readdirSync
} = require('fs'),
{
    directory:is_directory
} =  require('./is'),
{
    join
} = require('path');

exports.readTextFile = path =>{

    try{

        return readFileSync(path , 'utf8') ;
    
    }catch(err){
    }

    return '' ;
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