const is_file = require('../is/file'),
      create_directory = require('../directory/create');

const {
    dirname
} = require('path'),
{
    writeFileSync
} = require('fs');

module.exports = (path , data) => {

    if(!is_file(path)){

        create_directory(dirname(path)) ;
    }

    writeFileSync(path , data) ;
}