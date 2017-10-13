const {
    apply:tempate_apply
} = require('../../../../../template'),
{
    variableName:var_valid
} = require('../../../../../valid'),
process_expression = require('../expression');

module.exports = (context , attrs , node) =>{
    
    let {
        var:varName,
        scope,
        uri,
        method
    } = attrs,
    options = [];

    process_options(options , 'query' , node) ;

    process_options(options , 'body' , node) ;

    process_options(options , 'header' , node) ;

    if(varName){

        if(!var_valid(varName)){
            
            throw new Error(` ${varName} 不是一个合法的变量名称`) ;
        }

        if(scope === 'module'){

            context.params.push(varName) ;
        
        }else{

            varName = `var ${varName}` ;
        }
    }

    return tempate_apply('generate.file.script.assembly.web.api' , {
        varName,
        uri,
        method:method || 'get',
        options
    }) ;
}

function process_options(options , name , node){

    let paramNodes = node.findall(`./param[@scope="${name}"]`),
        result = [] ;

    for(let paramNode of paramNodes){

        let paramName = paramNode.get('name') ;

        if(paramName){

            options.push(`object_set(options , '${name}.${paramName}' , ${process_expression(paramNode.get('value'))}) ;`) ;
        }
    }
}