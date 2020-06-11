const {
    accessSync,
    constants
} = require('fs') ;

module.exports = path => {

    try{

        accessSync(path , constants.R_OK) ;

        return true ;

    }catch(err){

    }

    return false ;
}