const {
    format
} = require('../src/json'),
{
    PROPERTIES
} = require('../src/application');

module.exports = () =>{

    console.log(format(PROPERTIES)) ;
}