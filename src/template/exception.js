const {
    ResourceException
} = require('../exception') ;

class TemplateNotFoundExcepition extends ResourceException{
    
    constructor(name){

        super(name , '模板不存在') ;
    }
}

exports.TemplateNotFoundExcepition = TemplateNotFoundExcepition ;