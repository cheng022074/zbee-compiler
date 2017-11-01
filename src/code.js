const {
    file:is_file
} = require('./is'),
{
    readTextFile
} = require('./fs');

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

    get fullName(){

        let {
            scope,
            name
        } = this ;

        return `${scope}::${name}` ;
    }

    get isFile(){

        let path = this.path ;

        if(path){

            return is_file(me.path) ;
        }

        return false ;
    }
}

class BinCode extends Code{

    get caller(){

        let me = this ;

        if(me.isFile){

            return require(me.path) ;
        }
    }
}

module.BinCode = BinCode ;

class SourceCode extends Code{

    get code(){

        let me = this ;

        if(me.isFile){

            return readTextFile(me.path) ;
        }
    }
}

module.SourceCode = SourceCode ;