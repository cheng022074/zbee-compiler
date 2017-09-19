const FS = require('fs') ;

module.exports = (path , data) =>{

    FS.writeFileSync(path , data) ;
}