const {
    parseSourceCodeName,
    getBinCode
} = require('../application'),
{
    get
} = require('../object'),
{
    string:is_string
} = require('../is');

exports.get = (name , key) =>{

    let sourceCodeConfig = parseSourceCodeName(name , false) ;

    if(sourceCodeConfig){

        let {
            name
        } = sourceCodeConfig,
        config = getBinCode(`config::${name}`) ;

        if(config){

            if(is_string(key)){

                return get(config , key) ;
            }

            return config ;
        }
    }
}