const {
    parseSourceCodeNames,
    get
} = require('../src/application'),
{
    from
} = require('../src/array'),
{
    get:script_get
} = require('../src/script');

module.exports = (name = 'default') =>{

    let config = get(`package.${name}`) ;

    if(config){

        let {
            includes
        } = config ;

        let names = from(includes) ;

        for(let name of names){
            {
                let configs = parseSourceCodeNames(name) ;

                for(let config of configs){

                    console.log(script_get(config.path)) ;
                }
            } 
        }
    }
}