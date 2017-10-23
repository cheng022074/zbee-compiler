const {
    executeBinCode
} = require('../src/application') ;

module.exports = (name , ...argv) =>{

    return executeBinCode(name , ...argv) ;
}