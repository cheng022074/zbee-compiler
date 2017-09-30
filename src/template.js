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
} = require('ejs'),
{
    defined:is_defined
} = require('./is');

const applyCache = {} ;

exports.apply = (name , data) =>{

    if(applyCache.hasOwnProperty(name)){

        return applyCache[name](data) ;
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

    return '' ;
}

const getCache = {} ;

exports.get = name =>{

    if(is_defined(name)){

        if(getCache.hasOwnProperty(name)){
    
            return getCache[name] ;
        }
    
        let path = getFilePath(path_join(__dirname , '..' , 'template' , name2path(name))),
            template = readTextFile(path);
    
        if(template){
    
            return {
                path,
                template:template.trim()
            } ;
        }
    }

    return {
        path:null,
        template:''
    } ;
}