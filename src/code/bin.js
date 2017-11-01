const Code = require('../code') ;

class BinCode extends Code{

    get caller(){

        return require(this.config.path) ;
    }
}

module.exports = BinCode ;