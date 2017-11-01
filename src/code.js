class Code{

    constructor(config){

        let {
            path,
            name,
            scope,
            suffix
        } = config,
        me = this;

        me.path = path ;

        me.name = name ;

        me.scope = scope ;

        me.suffix = suffix ;
    }
}

class BinCode extends Code{

    get binPath(){

        return this.path ;
    }

    get caller(){

        return require(this.binPath) ;
    }
}

module.BinCode = BinCode ;

const {
    readTextFile
} = require('./fs'),
{

} = require('./is');

class SourceCode extends Code{

    get sourcePath(){

        return this.path ;
    }

    get code(){

        return readTextFile(this.sourcePath) ;
    }
}

module.SourceCode = SourceCode ;