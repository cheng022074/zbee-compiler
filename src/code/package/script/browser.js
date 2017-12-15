const package = require('../script') ;

module.exports = (code , packager) =>{

    let {
        name
    } = packager.config ;

    return package(code , packager , {
        template:'code.package.to.script.browser',
        name,
        isCompile:true
    }) ;
}