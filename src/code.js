class Code{

    constructor(config){

        this.config = config ;
    }
}

class BinCode extends Code{

    get caller(){

        return require(this.config.path) ;
    }
}

module.BinCode = BinCode ;

const {
    readTextFile
} = require('../fs') ;

class SourceCode extends Code{

    toString(){

        return readTextFile(this.config.path) ;
    }
}

module.SourceCode = SourceCode ;