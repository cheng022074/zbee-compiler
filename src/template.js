{
    compile
} = require('ejs'),
{
    getBinCode,
    parseSourceCodeName
} = require('./application'),
{
    TemplateNotFoundExcepition
} = require('./template/exception');

exports.apply = (name , data) =>{

    let template = getBinCode(`template::${name}`) ;

    if(template){

        return (compile(template , {
            rmWhitespace:parseSourceCodeName(name).suffix === '.html'
        }))(data);

    }else{

        throw new TemplateNotFoundExcepition(name) ;
    }
}