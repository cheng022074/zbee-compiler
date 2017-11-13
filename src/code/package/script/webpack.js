const package = require('../script') ;

module.exports = (code , packager) =>{

    return package(code , packager , 'code.package.to.script.webpack') ;
}