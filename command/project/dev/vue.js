const {
    exec
} = require('../../../src/child_process'),
opn = require('opn');

module.exports = async function(){

    console.log('正在准备启动开发环境 ...') ;    

    await exec('npm' , 'run' , 'dev') ;
}