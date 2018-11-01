const {
    apply
} = require('../template'),
{
    APPLICATION
} = require('../project'),
getTextMap = require('./map/text');

module.exports = (codes , path , {
    bootstrap,
    config
}) =>{

    let map = getTextMap(codes) ;

    const {
        defaultFolder
    } = APPLICATION ;

    return {
        [`${path}.js`]:apply('code.package.bundle.server' , {
            defaultFolder,
            map,
            config,
            bootstrap
        })
     } ;
}