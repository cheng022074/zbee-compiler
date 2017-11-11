const CHOKIDAR = require('chokidar'),
      application = require('../../application'),
      {
          from
      } = require('../../array');

module.exports = (scopes , fn) =>{

    let SCOPE_PATHS = application.SCOPE_PATHS,
        paths = [];

    scopes = from(scopes) ;

    for(let scope of scopes){

        paths.push(SCOPE_PATHS[scope]) ;
    }

    CHOKIDAR.watch(paths , {
        persistent: true
    })
    .on('ready', doWatch);
}

function doWatch(){

    let me = this ;

   me.on('add' , path =>{

        console.log(path) ;

   }) ;
}