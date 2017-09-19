const array_from = require('./array/from'),
      create_directory = require('./fs/directory/create'),
      {
          join
      } = require('path'),
      namespace_path = require('./path/namespace');

function generate(rootPath , items , suffixes , folders){

    items = array_from(items) ;

    let paths = [] ;

    for(let item of items){

        if(item.hasOwnProperty('folder')){

            let directoryPath = create_directory(join(rootPath , item['folder'])) ;

            paths.push(directoryPath) ;

            paths.push(...generate(directoryPath , item.contains , suffixes , folders)) ;

        }else if(item.hasOwnProperty('file')){

            paths.push(get_writer(item.writer , suffixes , folders)(join(rootPath , item['file']) , item)) ;

        }
    }

    return paths ;
}

function get_writer(name = 'default' , suffixes , folders){

    return require(namespace_path('../init/writer' , name)) ;
}

module.exports = generate ;