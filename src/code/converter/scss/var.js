const
Meta = require('../../meta/scss/var'),
Target = require('../../target');

module.exports = code =>{

    return new Target(code , Meta , 'code.bin.scss' , 'code.package.template') ;
}