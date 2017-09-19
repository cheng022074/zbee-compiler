const {
    mkdirSync
} = require('fs'),
    is_directory = require('../is/directory');

module.exports = path =>{

    if(!is_directory(path)){

        mkdirSync(path) ;
    }

    return path ;
}