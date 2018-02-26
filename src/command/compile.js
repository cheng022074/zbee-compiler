const {
    SourceCode
} = require('../code') ;

module.exports = name =>{

    let code = SourceCode.get(name) ;

    if(code.exists){

        console.log(code.target.meta.params) ;
    }
}