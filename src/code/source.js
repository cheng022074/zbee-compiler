const {
    readTextFile
} = require('../fs'),
Code = require('../code') ;

class SourceCode extends Code{

    toString(){

        return readTextFile(this.config.path) ;
    }
}

module.exports = SourceCode ;