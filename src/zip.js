const decompress = require('decompress'),
{
    createReadStream
} = require('fs'),
{
    generateDirectory
} = require('./fs'),
{
    dirname
} = require('path');

exports.unzip = (sourcePath , distPath) =>{

    return decompress(sourcePath , distPath) ;
}

const archiver = require('archiver'),
      {
        createWriteStream
      } = require('fs');

exports.zip = ({
    files = [],
    directories = []
} , distPath) =>{

    let archive = archiver('zip', {
        zlib:{
            level: 9
        }
    }) ;

    generateDirectory(dirname(distPath)) ;

    archive.pipe(createWriteStream(distPath));

    files.forEach(({
        path,
        name
    }) => archive.append(createReadStream(path) , {
        name
    })) ;

    directories.forEach(({
        path,
        name
    }) => archive.directory(path , name)) ;

    archive.finalize();
}