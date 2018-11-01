const {
    apply
} = require('../template'),
{
    APPLICATION
} = require('../project'),
getTextMap = require('./map/text');

module.exports = (codes , path , {
    config
}) =>{

    let map = getTextMap(codes) ;
    
    const {
        defaultFolder
    } = APPLICATION ;

    return {
        [`${path}.js`]:apply('code.package.bundle.browser' , {
            defaultFolder,
            map,
            config
        })
    } ;
}