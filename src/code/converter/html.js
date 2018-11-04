const
Meta = require('../meta/html'),
Target = require('../target');

module.exports = code =>{

    return new Target(code , Meta , 'code.bin.html' , 'code.package.html') ;
}