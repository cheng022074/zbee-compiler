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

    generate(config) ;

    return {
        params:[],
        code:codes.join('')
    } ;
}

function generate(config){

    console.log(format(config)) ;
}