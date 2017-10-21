const {
    getSourceCode
} = require('../src/application') ;

module.exports = name =>{

    console.log(getSourceCode(name)) ;
}