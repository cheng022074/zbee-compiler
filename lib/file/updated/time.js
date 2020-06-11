const {
    statSync
} = require('fs') ;

module.exports = path => {

    try{

        return statSync(path).mtime.getTime() ;

    }catch(err){

    }

    return -1 ;
}