const {
    executeBinCode
} = require('../src/application') ;

module.exports = (folder , commandName , ...args) =>{

    if(commandName){

        executeBinCode(`command::project.${folder}.${commandName}` , ...args) ;

    }else{

        console.info('请指定名称') ;
    }
}