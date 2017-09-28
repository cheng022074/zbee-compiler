const {
    join:path_join,
    extname
} = require('path'),
{
    name2path,
    getFilePath
} = require('./path'),
{
    readTextFile
} = require('./fs'),
{
    compile
} = require('ejs');

const cache = {} ;

exports.apply = (name , data) =>{

    if(cache.hasOwnProperty(name)){

        return cache[name](data) ;
    }

    let path = getFilePath(path_join(__dirname , '..' , 'template' , name2path(name))),
        template = readTextFile(path).trim() ;

    if(template){

        return (cache[name] = compile(template , {
            rmWhitespace:extname(path) === '.html'
        }))(data);
    }
}