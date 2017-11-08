const {
    render
} = require('ejs'),
application = require('./application'),
{
    TemplateNotFoundExcepition
} = require('./template/exception');

// 考虑将模板编译后在内存级进行缓存

exports.apply = (name , data) =>{

    let templateName = `template::${name}`,
        template = application.getBinCode(templateName) ;

    if(template){

        return render(template.caller , data);

    }else{

        throw new TemplateNotFoundExcepition(name) ;
    }
}