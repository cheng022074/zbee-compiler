const application = require('../src/application') ;

module.exports = (name = 'default') =>{

    let backup = application.get('backup') ;

    if(backup.hasOwnProperty(name)){

        let config = backup[name] ;

        if(config.hasOwnProperty('to')){

            let path = application.executeBinCode(`backup.${config.to}` , name , config) ;

            if(path){

                console.log('已备份' , path) ;
            }
        }
    
    }else{

        console.log('未找到备份设置') ;
    }
}