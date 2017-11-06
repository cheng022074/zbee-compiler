const {
    apply
} = require('../../../template') ;

module.exports = code =>{

    return apply('compile.script.function' , code.meta) ;
}