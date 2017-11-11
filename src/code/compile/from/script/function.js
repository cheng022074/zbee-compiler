const get_script_data = require('../script');

module.exports = sourceCode =>{

    let {
            scoped
        } = sourceCode.meta,
        template;

    if(scoped){
        
        template = 'code.compile.script.function.scope' ;
    
    }else{

        template = 'code.compile.script.function' ;
    }

    return get_script_data(sourceCode , template) ;
}