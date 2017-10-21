const {
    parseSourceCodeName,
    getSourceCode
} = require('../application'),
{
    get
} = require('../object'),
{
    string:is_string
} = require('../is');

exports.get = (name , key) =>{

    let config = parseSourceCodeName(name , false) ;

    if(config){

        let {
            name
        } = config ;

        let config = getSourceCode(`config::${name}`) ;

        if(config){

            if(is_string(key)){

                return get(config , key) ;
            }

            return config ;
        }
    }
}