const {
    get:config_get
} = require('../../../../config'),{
    execute:script_execute
} = require('../../../../script'),{
    string:is_string,
    array:is_array
} = require('../../../../is');

module.exports = (el , context , type) =>{

    let codes = [],
        childEls ;
    
    if(is_array(el)){

        childEls = el ;
    
    }else{

        childEls = el.getchildren() ;
    }
    
    for(let childEl of childEls){

        let tag = childEl.tag,
            className = config_get(`component.${type}` , tag) ;

        if(className){

            let code = script_execute(className , context , childEl.attrib , childEl) ;

            if(is_string(code)){

                codes.push(code) ;
            }
        }
    }

    return codes.join('\n') ;
}