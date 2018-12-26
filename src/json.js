const {
    readTextFile
} = require('./fs'),
{
    stripComment
} = require('./script');

exports.load = path =>{

    try{

        return JSON.parse(stripComment(readTextFile(path))) ;
    
    }catch(err){
    }
}