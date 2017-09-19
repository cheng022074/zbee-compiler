const FS = require('fs'),
      {
          join
      } = require('path'),
      COMPILER_PATH = require('../src/path/compiler'),
      is_file = require('../src/fs/is/file'),
      read_json_file = require('../src/fs/file/json/read'),
      generate = require('../src/generate');

module.exports = (name = 'default') =>{

    let APPLICATION_PATH ;

    try{

        APPLICATION_PATH = require('../src/path/application') ;

    }catch(err){

        console.log(err.message) ;

        return ;
    }

    {
        let path = join(APPLICATION_PATH , 'init.json') ;

        if(is_file(path)){
    
            result(generate(APPLICATION_PATH , read_json_file(path))) ;
            
            return ;
        }
    }

    {
        let path = join(COMPILER_PATH , 'init' , `${name}.json`) ;
        
        if(is_file(path)){
    
            result(generate(APPLICATION_PATH , read_json_file(path))) ;
    
        }
    }
    
}

function result(paths){

    if(paths.length === 0){

        return ;
    }

    console.log('初始化开始')

    for(let path of paths){

        console.log('初始化' , path) ;
    }

    console.log('初始化结束') ;
}