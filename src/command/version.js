const {
    parse
} = require('../xml'),
build = require('../template/build/xml');

module.exports = () =>{

    console.log(build(parse('<function/>').documentElement , 'template.element.script').toString()) ;

    //console.log(require('../../package.json').version) ;
}