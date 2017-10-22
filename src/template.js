const {
    render
} = require('ejs'),
{
    getBinCode,
    parseSourceCodeName
} = require('./application'),
{
    TemplateNotFoundExcepition
} = require('./template/exception');

exports.apply = (name , data) =>{

    let templateName = `template::${name}`,
        template = getBinCode(templateName) ;

    if(template){

        return render(template , data);

    }else{

        throw new TemplateNotFoundExcepition(name) ;
    }
}