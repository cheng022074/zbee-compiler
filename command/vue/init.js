const compiler = require('../../src/compiler'),
{
    decompress
} = require('../../src/zip'),
{
    PATH
} =  require('../../src/application'),
{
    exec
} = require('../../src/child_process'),
vue_dev = require('./dev');

module.exports = async function(name = 'zbee'){

    let {
        path
    } = compiler.parseSourceCodeName('template::project.vue' , '.zip') ;

    await decompress(path , PATH) ;

    console.log('正在准备初始化依赖模块 ...') ;

    await exec('cnpm' , 'install') ;

    console.log('正在准备启动开发环境 ...') ;

    await vue_dev() ;
}