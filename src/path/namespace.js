const {
        join,
        sep
    } = require('path'),
    dotRe = /\./g;

module.exports = (path , namespace) =>{

    return join(path , namespace.replace(dotRe , sep)) ;
}