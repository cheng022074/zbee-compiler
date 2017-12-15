const package = require('../script') ;

module.exports = (code , packager) =>{

    return package(code , packager , {
        template:'code.package.to.script.webpack'
    }) ;
}