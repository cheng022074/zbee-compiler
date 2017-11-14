const application_watch = require('../src/application/code/watch'),
      application = require('../src/application'),
      compile =  require('./compile');

module.exports = () =>{

    application_watch(application.get('watch') , (type , name) =>{

        switch(type){

            case 'create':
            case 'update':
            case 'remove':

                compile(name) ;
        }

    }) ;

    console.log('监控已启动...') ;
}