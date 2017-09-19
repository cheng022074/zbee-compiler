const FS = require('fs'),
      {
          join
      } = require('path'),
      COMPILER_PATH = require('../src/path/compiler'),
      is_file = require('../src/fs/is/file'),
      read_json_file = require('../src/fs/file/json/read'),
      generate = require('../src/generate');

module.exports = (name = 'default') =>{

    let path = join(COMPILER_PATH , 'init' , `${name}.json`) ;

    if(is_file(path)){

        let APPLICATION_PATH ;

        try{

            APPLICATION_PATH = require('../src/path/application') ;

        }catch(err){

            console.log(err.message) ;

            return ;
        }

        generate(APPLICATION_PATH , read_json_file(path)) ;

    }
    
}