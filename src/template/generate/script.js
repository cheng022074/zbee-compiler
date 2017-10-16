const {
    basename
} = require('path'),
{
    extname,
    basename:path_basename,
    COMPILE_SOURCE_PATH,
    getApplicationPath
} = require('../../path');

module.exports = (data , path) =>{

    return {
        name:path_basename(path , COMPILE_SOURCE_PATH),
        className:basename(path , extname(path)),
        body:data
    } ;
}