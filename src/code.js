const {
    simpleObject:is_simple_object,
    string:is_string
} = require('./is') ;

class Code{

    constructor(config){

        if(is_simple_object(config)){

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
        
        }else if(is_string(config)){

            
        }
    }

    get isFile(){

        let me = this ;

        return !me.hasOwnProperty('path') && !me.hasOwnProperty('suffix') ;
    }
}

class BinCode extends Code{

    get binPath(){

        return this.path ;
    }

    get caller(){

        let binPath = this.binPath ;

        if(binPath){

            return require(binPath) ;
        }
    }
}

module.BinCode = BinCode ;

const {
    readTextFile
} = require('./fs');

class SourceCode extends Code{

    get sourcePath(){

        return this.path ;
    }

    get code(){

        return readTextFile(this.sourcePath) ;
    }
}

module.SourceCode = SourceCode ;