const {
    SourceCode
} = require('../code') ;

module.exports = name =>{

    console.log(SourceCode.get(name).target) ;
}