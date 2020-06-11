const {
    statSync
} = require('fs') ;

module.exports = path => {

    try{

        return statSync(path).isDirectory() ;

    }catch(err){

    }

    return false ;
}