const {
    executeBinCode
} = require('../src/application') ;

module.exports = (name , ...argv) =>{

    executeBinCode(name , ...argv) ;
}