const
Meta = require('../../meta/xml/class'),
Target = require('../../target/script');

module.exports = code =>{

    return new Target(code , Meta , 'code.bin.script.class' , 'code.package.script.class') ;
}