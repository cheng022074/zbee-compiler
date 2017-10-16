const {
    apply:tempate_apply
} = require('../../../../../template'),
{
    variableName:var_valid
} = require('../../../../../valid'),
{
    join:path_join
} = require('path'),
PATH = require('../../../../../path'),
{
    name2path,
    getApplicationPath
} = PATH,
{
    readJSONFile
} = require('../../../../../fs'),
process_expression = require('../expression');

module.exports = (context , attrs , node) =>{
    
    let {
        var:varName,
        scope,
        uri,
        method,
        file,
        scope
    } = attrs,
    optionsName = `options_${Date.now()}`;

    if(file){

        options = `${optionsName} = ${JSON.stringify(readJSONFile(path_join(getApplicationPath(scope) , name2path(file , '.json'))) || {})};`;

    }else{

        options = [];
        
        process_options(optionsName , options , 'query' , node) ;
    
        process_options(optionsName , options , 'body' , node) ;
    
        process_options(optionsName , options , 'header' , node) ;

        options = options.join('\n') ;
    }

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
        optionsName,
        varName,
        uri,
        method:method || 'get',
        options
    }) ;
}

function process_options(optionsName , options , name , node){

    let paramNodes = node.findall(`./param[@scope="${name}"]`),
        result = [] ;

    for(let paramNode of paramNodes){

        let paramName = paramNode.get('name') ;

        if(paramName){

            options.push(`object_set(${optionsName} , '${name}.${paramName}' , ${process_expression(paramNode.get('value'))}) ;`) ;
        }
    }
}