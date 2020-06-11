const {
    statSync
} = require('fs') ;

module.exports = path => {

    try{

        return statSync(path).isFile() ;

    }catch(err){

    }

    return false ;
}