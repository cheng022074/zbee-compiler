const {
    apply
} = require('../../../template') ;

module.exports = code =>{

    return apply('code.package.script.function' , code.meta) ;
}