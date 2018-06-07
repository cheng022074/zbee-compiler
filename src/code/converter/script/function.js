const
Meta = require('../../meta/script'),
Target = require('../../target/script/function');

module.exports = code =>{

    return new Target(code , Meta , 'code.bin.script.function' , 'code.package.script.function') ;
}