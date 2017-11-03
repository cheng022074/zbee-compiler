const {
    exec
} = require('../../src/child_process'),
opn = require('opn');

module.exports = async function(){

    opn('http://127.0.0.1:8010/') ;

    await exec('npm' , 'run' , 'dev') ;
}