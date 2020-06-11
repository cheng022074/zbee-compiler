const is_file = require('../is/file'),
      create_directory = require('../directory/create');

const {
    basename
} = require('path'),
{
    writeFileSync
} = require('fs');

module.exports = (path , data) => {

    if(is_file(path)){


    }else{

        create_directory(basename(path)) ;

        writeFileSync(path , data) ;
    }
}