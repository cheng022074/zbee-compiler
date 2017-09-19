const {
    existsSync,
    statSync
} = require('fs') ;

module.exports = path =>{

    return existsSync(path) && statSync(path).isFile() ;
}