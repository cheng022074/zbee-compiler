const {
    parseSourceCodeNames,
    get
} = require('../src/application'),
{
    from
} = require('../src/array');

module.exports = (name = 'default') =>{

    let config = get(`package.${name}`) ;

    if(config){

        let {
            includes
        } = config ;

        let names = from(includes) ;

        for(let name of names){

            console.log(parseSourceCodeNames(name)) ;
        }
    }
}