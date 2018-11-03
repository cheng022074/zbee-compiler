const {
    watch
} = require('chokidar'),
{
    APPLICATION
} = require('../project'),
{
    join
} = require('path');

module.exports = () =>{

    watch(join(APPLICATION.getFolderPath('debug') , 'test11.html'))
    .on('add' , () => console.log('add'))
    .on('change' , () => console.log('change'))
    .on('unlink' , () => console.log('unlink'));
}