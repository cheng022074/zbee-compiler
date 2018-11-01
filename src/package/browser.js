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
    config
}) =>{

    let map = getTextMap(codes) ;

    path = `${path}.js`;

    const {
        defaultFolder
    } = APPLICATION ;

    writeTextFile(path , apply('code.package.browser' , {
        defaultFolder,
        map,
        config
    })) ;

    console.log('已生成' , path) ;

    return [
        path
    ] ;
}