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

const applyCache = {} ;

exports.apply = (name , data) =>{

    if(applyCache.hasOwnProperty(name)){

        return cache[name](data) ;
    }

    let {
        path,
        template
    } = exports.get(name) ;

    if(template){

        return (applyCache[name] = compile(template , {
            rmWhitespace:extname(path) === '.html'
        }))(data);
    }
}

const getCache = {} ;

exports.get = name =>{

    if(getCache.hasOwnProperty(name)){

        return getCache[name] ;
    }

    let path = getFilePath(path_join(__dirname , '..' , 'template' , name2path(name))),
        template = readTextFile(path).trim();

    if(template){

        return {
            path,
            template
        } ;
    }
}