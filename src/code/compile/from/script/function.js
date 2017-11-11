const get_script_data = require('../script');

module.exports = sourceCode =>{

    let data = get_script_data(sourceCode),
        {
            scoped
        } = data,
        template;

    if(scoped){
        
        template = 'code.compile.script.function.scope' ;
    
    }else{

        template = 'code.compile.script.function' ;
    }

    return {
        template,
        ...data
    } ;
}