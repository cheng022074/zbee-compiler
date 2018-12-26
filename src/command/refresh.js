const {
    remove
} = require('../fs'),
{
    APPLICATION
} = require('../project');

module.exports = () =>{

    remove(APPLICATION.getFolderPath('bin')) ;

    remove(APPLICATION.getFolderPath('package')) ;

    // 更新 package.json

    console.log('已刷新' , APPLICATION.rootPath) ;
}