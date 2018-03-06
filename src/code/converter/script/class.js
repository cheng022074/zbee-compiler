const
Meta = require('../../meta/xml/test'),
Target = require('../../target/script');

module.exports = code =>{

    return new Target(code , Meta , 'code.bin.script.class' , 'code.package.script.class') ;
}