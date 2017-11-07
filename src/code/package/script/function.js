const {
    apply
} = require('../../../template') ;

module.exports = code =>{

    console.log(code.meta) ;

    return apply('code.package.script.function' , code.meta) ;
}