const {
    readTextFile
} = require('./fs'),
strip = require('strip-comment');

exports.load = path =>{

    try{

        return JSON.parse(strip(readTextFile(path))) ;
    
    }catch(err){
    }

    return {} ;
}