const application = require('../src/application') ;

module.exports = (name = 'default') =>{

    let backup = application.get('backup') ;

    if(backup.hasOwnProperty(name)){

        let config = backup[name] ;

        console.log('备份设置' , config) ;
    
    }else{

        console.log('未找到备份设置') ;
    }
}