const {
    apply
} = require('../../../../template') ;

module.exports = code =>{

    return apply('code.compile.script.function' , code.meta) ;
}