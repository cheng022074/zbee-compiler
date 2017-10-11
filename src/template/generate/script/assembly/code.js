const {
    get:config_get
} = require('../../../../config'),{
    execute:script_execute
} = require('../../../../script'),{
    string:is_string
} = require('../../../../is');

module.exports = (el , type) =>{

    let codes = [],
        childEls = el.getchildren() ;

    for(let childEl of childEls){

        let tag = childEl.tag,
            className = config_get(`component.${type}` , tag) ;

        if(className){

            let code = script_execute(className , childEl.attrib , childEl) ;

            if(is_string(code)){

                codes.push(code) ;
            }
        }
    }

    return codes.join('\n') ;
}