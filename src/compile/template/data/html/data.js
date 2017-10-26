const {
    parseSourceCodeName
} = require('../../../../application'),
{
    readHTMLFile
} = require('../../../../fs'),
{
    compile
} = require('../../../../html/template');

module.exports = (data , name) =>{

    let config = parseSourceCodeName(name , '.html') ;

    if(config){

        console.log(compile(readHTMLFile(config.path))) ;
    }

    return {
        params:[],
        code:''
    } ;
}