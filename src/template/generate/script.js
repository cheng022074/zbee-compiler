const {
    basename
} = require('path'),
{
    extname,
    path2name
} = require('../../path');

module.exports = (data , path) =>{

    return {
        name:path2name(path),
        className:basename(path , extname(path)),
        body:data
    } ;
}