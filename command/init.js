const FS = require('fs'),
      {
          join
      } = require('path'),
      COMPILER_PATH = require('../src/path/compiler'),
      is_file = require('../src/fs/is/file');

module.exports = (name = 'default') =>{

    let path = join(COMPILER_PATH , 'init' , `${name}.json`) ;

    if(is_file(path)){

        
    }
    
}