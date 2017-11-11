const application_watch = require('../src/application/code/watch'),
      compile =  require('./compile');

module.exports = () =>{

    application_watch('command' , (type , name) =>{

        switch(type){

            case 'add':
            case 'change':

                compile(name) ;
        }

    }) ;

    console.log('监控已启动...') ;
}