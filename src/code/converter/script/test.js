const
Meta = require('../../meta/xml/test'),
Target = require('../../target');

module.exports = code =>{

    return new Target(code , Meta , 'code.bin.script.test' , 'code.package.script.test') ;
}