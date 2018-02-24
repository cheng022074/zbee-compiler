const {
    readFileSync
} = require('fs') ;

exports.readTextFile = path =>{

    try{

        return readFileSync(path , 'utf8') ;
    
    }catch(err){
    }

    return '' ;
}