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

        let me = this ;

        if(me.hasOwnProperty('$isFile')){

            return me.$isFile ;
        }

        let path = this.path ;

        if(path){

            return  me.$isFile = is_file(me.path) ;
        }

        return  me.$isFile = false ;
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

exports.BinCode = BinCode ;

class SourceCode extends Code{

    get code(){

        let me = this ;

        if(me.isFile){

            return readTextFile(me.path) ;
        }
    }

    get compiledCode(){

        return ;
    }

    get packagedCode(){

        return ;
    }
}

exports.SourceCode = SourceCode ;