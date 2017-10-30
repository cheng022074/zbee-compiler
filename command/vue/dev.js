const {
    exec
} = require('../../src/child_process') ;

module.exports = async function(){

    await exec('npm' , 'start') ;
}