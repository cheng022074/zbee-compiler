const {
    apply
} = require('../template'),
{
    writeTextFile
} = require('../fs'),
{
    join
} = require('path'),
getTextMap = require('./map/text');

module.exports = (codes , path) =>{

    let map = getTextMap(codes) ;

    let metaPath = join(path , 'index.xml');

    writeTextFile(metaPath , apply('code.package.meta' , map)) ;

    console.log('已生成' , metaPath) ;

    let libPath = join(path , 'index.js');

    writeTextFile(libPath , apply('code.package.lib' , map)) ;

    console.log('已生成' , libPath) ;

    return [
        metaPath,
        libPath
    ] ;
}