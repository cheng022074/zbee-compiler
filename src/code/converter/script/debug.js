const
Meta = require('../../meta/script'),
Target = require('../../target/script');

module.exports = code =>{

    return new Target(code , Meta , 'code.bin.script.debug') ;
}