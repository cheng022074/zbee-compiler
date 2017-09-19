const {
    writeFileSync
} = require('fs') ;

module.exports = (path , data) =>{

    writeFileSync(path , data) ;
}