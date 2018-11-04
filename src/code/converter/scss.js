const
Meta = require('../meta/scss'),
Target = require('../target');

module.exports = code =>{

    return new Target(code , Meta , 'code.bin.css' , 'code.package.css') ;
}