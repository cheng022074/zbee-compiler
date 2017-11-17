const {
    NotDefinedException
} = require('../exception') ;

class TemplateNotFoundExcepition extends NotDefinedException{
    
    constructor(name){

        super(name , '模板不存在') ;
    }
}

exports.TemplateNotFoundExcepition = TemplateNotFoundExcepition ;