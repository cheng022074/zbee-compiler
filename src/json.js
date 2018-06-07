const {
    readTextFile
} = require('./fs'),
{
    js
} = require('strip-comment');

exports.load = path =>{

    try{

        return JSON.parse(js(readTextFile(path))) ;
    
    }catch(err){
    }

    return {} ;
}