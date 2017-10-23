const {
    getSourceCode
} = require('../src/application'),
{
    parse
} = require('../src/html');

module.exports = () =>{

    let doc = parse(getSourceCode('html::Demo')) ;

    console.log(doc.body.toString()) ;
}