const application_watch = require('../src/application/code/watch'),
      application = require('../src/application'),
      compile =  require('./compile');

module.exports = () =>{

    application_watch(application.get('command') , (type , name) =>{

        switch(type){

            case 'add':
            case 'change':
            case 'remove':

                compile(name) ;
        }

    }) ;

    console.log('监控已启动...') ;
}