const {
    parse,
    stringify
} = require('../../../html/json'),
{
    format
} = require('../../../json');

module.exports = doc =>{

    let config = parse(doc),
        codes = [];

    return {
        params:[],
        code:generate(config)
    } ;
}

function generate(config){

    console.log(format(config)) ;

    return stringify(config) ;
}