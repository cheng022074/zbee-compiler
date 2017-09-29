const {
    basename
} = require('path'),
{
    extname
} = require('../../../path');

module.exports = (data , path) =>{

    return {
        className:basename(path , extname(path)),
        body:data
    } ;
}