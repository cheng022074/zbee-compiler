const {
    length:assert_length
} = require('../src/assert'),
{
    keys
} = require('../src/object');

module.exports = () =>{

    console.log(keys([{a:1,b:2 , c:{aa:1,bb:1}}])) ;
}