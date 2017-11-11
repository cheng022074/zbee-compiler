const {
    compile
} = require('ejs'),
application = require('./application'),
{
    TemplateNotFoundExcepition
} = require('./template/exception'),
templates = {},
suffixRe = /\.[^\.]+$/;

exports.apply = (name , data) =>{

    if(templates.hasOwnProperty(name)){

        return templates[name](data) ;
    }

    let templateName = `template::${name}`,
        template = application.getBinCode(templateName) ;

    if(template && template.isFile){

        template = templates[name] = compile(template.caller , {
            rmWhitespace:template.baseSuffix !== '.html'
        }) ;

        return template(data);

    }else{

        throw new TemplateNotFoundExcepition(name) ;
    }
}