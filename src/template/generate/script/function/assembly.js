const {
    parse
} = require('elementtree'),{
    get:config_get
} = require('../../../../config'),{
    execute:script_execute
} = require('../../../../script'),{
    string:is_string
} = require('../../../../is'),
generate_params = require('../../script');

module.exports = (data , path) =>{

    let {
        name,
        className
    } = generate_params(data , path) ;

    try{

        let root = parse(data).getroot();

        if(root.tag === 'function'){
            
            let codes = [],
                childEls = root.find('body').getchildren() ;

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
                name,
                className,
                body:codes.join('\n')
            } ;
        }

    }catch(err){

        console.error(data) ;

        console.error(err) ;
    }

    return {
        name,
        className,
        body:''
    } ;
}