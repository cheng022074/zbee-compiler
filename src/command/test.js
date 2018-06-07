const {
    fork
} = require('child_process'),
{
    resolve
} = require('path'),
{
    APPLICATION
} = require('../project'),
compile = require('./compile');

module.exports = name => {

    if(!name){

        console.info('请指定测试名称') ;

        return ;
    }

    if(compile(`test::${name}`)){

        fork(resolve(__dirname , '../../node_modules/mocha/bin/mocha') , [
            '-t',
            APPLICATION.testTimeout,
            APPLICATION.generateBinPath('test' , name)
        ]) ;
    }
}