const {
    readTextFile
} = require('./fs') ;

exports.load = path =>{

    try{

        return JSON.parse(readTextFile(path)) ;
    
    }catch(err){
    }

    return {} ;
}