const decompress = require('decompress');

exports.unzip = (sourcePath , distPath) =>{

    return decompress(sourcePath , distPath) ;
}

exports.zip = () =>{

    
}