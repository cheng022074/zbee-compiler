const {
    render
} = require('ejs'),
application = require('./application'),
{
    TemplateNotFoundExcepition
} = require('./template/exception');

exports.apply = (name , data) =>{

    let templateName = `template::${name}`,
        template = application.getBinCode(templateName) ;

    console.log(template) ;

    if(template){

        return render(template.caller , data);

    }else{

        throw new TemplateNotFoundExcepition(name) ;
    }
}