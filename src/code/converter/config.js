const
Meta = require('../meta/text'),
Target = require('../target');

module.exports = code =>{

    return new Target(code , Meta , 'code.bin.config' , 'code.package.config') ;
}