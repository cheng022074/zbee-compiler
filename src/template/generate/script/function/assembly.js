const {
    parse
} = require('elementtree'),{
    get:config_get
} = require('../../../../config'),{
    execute:script_execute
} = require('../../../../script'),{
    string:is_string
} = require('../../../../is');

module.exports = data =>{

    try{

        let childEls = parse(data).find('body').getchildren(),
            codes = [];

        for(let childEl of childEls){

            let tag = childEl.tag,
                className = config_get('component.script' , tag) ;

            if(className){

                let code = script_execute(className , childEl.attrib) ;

                if(is_string(code)){

                    codes.push(code) ;
                }
            }
        }

        return {
            body:codes.join('\n')
        } ;

    }catch(err){

        console.error(data) ;

        console.error(err) ;
    }

    return {
        body:''
    } ;
}