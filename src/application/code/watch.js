const CHOKIDAR = require('chokidar'),
      application = require('../../application'),
      {
          from
      } = require('../../array'),
      {
          extname,
          basename
      } = require('../../path');

module.exports = (scopes , fn) =>{

    let SCOPE_PATHS = application.SCOPE_PATHS,
        SCOPE_SUFFIXES = application.SCOPE_SUFFIXES,
        paths = [];

    scopes = from(scopes) ;

    for(let scope of scopes){

        paths.push(SCOPE_PATHS[scope]) ;
    }

    CHOKIDAR.watch(paths , {
        persistent: true
    })
    .on('ready', function(){

        let me = this ;
        
        me.on('add' , doWatch.bind(me , 'create' , paths , scopes , SCOPE_SUFFIXES , fn)) ;

        me.on('change' , doWatch.bind(me , 'update' , paths , scopes , SCOPE_SUFFIXES , fn)) ;

        me.on('unlink' , doWatch.bind(me , 'remove' , paths , scopes , SCOPE_SUFFIXES , fn)) ;

    });
}

function doWatch(type , scopePaths , scopes , scopeSuffixes , fn , path){

    let len = scopePaths.length ;

    for(let i = 0 ; i < len ; i ++){

        let scopePath = scopePaths[i] ;

        if(path.indexOf(scopePath) === 0){

            let scope = scopes[i],
                suffixes = scopeSuffixes[scope];

            if(suffixes.includes(extname(path))){

                let name = `${scope}::${basename(path , scopePath)}` ;

                let code = application.getSourceCode(name) ;

                code.sync() ;

                application.getBinCode(name).sync();

                if(!code.isFile && type !== 'remove'){

                    console.log('代码执行出现错误' , name) ;

                }else{

                    fn(type , name) ;
                }

                break ;
            }
        }
    }
}