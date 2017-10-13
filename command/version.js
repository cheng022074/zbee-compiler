const {
    readJSONFile
} = require('../src/fs'),
{
    join:path_join
} = require('path'),
{
    getCompilerPath
} = require('../src/path');

module.exports = () =>{

    console.log(readJSONFile(getCompilerPath('package.json')).version) ;
}