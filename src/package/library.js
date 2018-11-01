const {
    apply
} = require('../template'),
{
    join
} = require('path'),
getTextMap = require('./map/text');

module.exports = (codes , path) =>{

    let map = getTextMap(codes) ;

    return {
        [join(path , 'index.xml')]:apply('code.package.bundle.meta' , map),
        [join(path , 'index.js')]:apply('code.package.bundle.lib' , map)
     } ;
}