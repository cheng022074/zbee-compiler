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
        [join(path , 'index.xml')]:apply('code.package.meta' , map),
        [join(path , 'index.js')]:apply('code.package.lib' , map)
     } ;
}