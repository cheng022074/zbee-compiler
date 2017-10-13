const {
    apply:tempate_apply
} = require('../../../../../template'),
{
    set:object_set
} = require('../../../../../object');

module.exports = (context , attrs , node) =>{
    
    let {
        var:varName,
        uri,
        method
    } = attrs,
    options = {};

    process_options(options , 'query' , node) ;

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

            object_set(options , `${name}.${paramName}` , paramNode.get('value')) ;
        }
    }
}