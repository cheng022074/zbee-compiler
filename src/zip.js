const decompress = require('decompress');

exports.decompress = (sourcePath , distPath) =>{

    return decompress(sourcePath , distPath) ;
}