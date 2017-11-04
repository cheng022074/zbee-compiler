const compiler = require('../../../src/compiler'),
{
    decompress
} = require('../../../src/zip'),
{
    PATH
} =  require('../../../src/application'),
{
    exec
} = require('../../../src/child_process');

module.exports = async function(){

    let {
        path
    } = compiler.parseSourceCodeName('template::project.vue' , '.zip') ;

    await decompress(path , PATH) ;

    console.log('正在准备初始化依赖模块 ...') ;

    await exec('cnpm' , 'install') ;

    console.log('正在准备启动开发环境 ...') ;
}