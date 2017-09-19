const {
        writeFileSync
    } = require('fs'),
    is_file = require('../../is/file');

module.exports = (path , data) =>{

    if(!is_file(path)){

        writeFileSync(path , data) ;
    }

    return path ;
}