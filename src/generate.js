const array_from = require('./array/from'),
      create_directory = require('./fs/directory/create'),
      create_file = require('./fs/file/text/create/empty'),
      {
          join
      } = require('path');

function generate(rootPath , items){

    items = array_from(items) ;

    for(let item of items){

        if(item.hasOwnProperty('folder')){

            generate(create_directory(join(rootPath , item['folder'])) , item.contains) ;
        
        }else if(item.hasOwnProperty('file')){

            create_file(join(rootPath , item['file'])) ;
        }
    }
}


module.exports = generate ;