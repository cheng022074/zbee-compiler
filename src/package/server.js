const {
    apply
} = require('../template'),
{
    writeTextFile
} = require('../fs'),
{
    APPLICATION
} = require('../project'),
getTextMap = require('./map/text');

module.exports = (codes , path , {
    bootstrap,
    config
}) =>{

    let map = getTextMap(codes) ;

    path = `${path}.js`;

    const {
        defaultFolder
    } = APPLICATION ;

    writeTextFile(path , apply('code.package.server' , {
        defaultFolder,
        map,
        config,
        bootstrap
    })) ;

    console.log('已生成' , path) ;

    return [
        path
    ] ;
}