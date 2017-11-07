const application = require('../src/application') ;

module.exports = (folder , commandName , ...args) =>{

    if(commandName){

        application.executeBinCode(`command::project.${folder}.${commandName}` , ...args) ;

    }else{

        console.info('请指定名称') ;
    }
}