const {
    parseSourceCodeName
} = require('../../../../application'),
{
    readHTMLFile
} = require('../../../../fs');

module.exports = (config , name) =>{

    let htmlConfig = parseSourceCodeName(name , '.html') ;

    if(htmlConfig){

        console.log(readHTMLFile(htmlConfig.path)) ;

        console.log(config) ;
    }

    return {
        params:[],
        code:''
    } ;
}