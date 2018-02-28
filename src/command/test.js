const {
    fork
} = require('child_process'),
{
    resolve,
    join
} = require('path'),
{
    APPLICATION
} = require('../project');

module.exports = name => {

    fork(resolve(__dirname , '../../node_modules/mocha/bin/mocha') , [
        join(APPLICATION.generateBinPath('test' , 'is'))
    ]) ;
}