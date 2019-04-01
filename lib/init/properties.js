module.exports = () =>{

    const {
        file:isFile
    } = require('../../src/is'),
    {
        join
    } = require('path'),{
        writeTextFile,
        readTextFile
    } = require('../../src/fs'),
    path = join(process.cwd() , 'properties.json');
    
    if(!isFile(path)){
    
        writeTextFile(path , readTextFile(join(__dirname , '../template/properties.json'))) ;
    }
}