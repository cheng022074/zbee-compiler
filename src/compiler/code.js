const {
    SourceCode,
    BinCode
} = require('../code') ;

class CompilerBinCode extends BinCode{

    get caller(){

        let me = this ;

        if(me.isFile){

            if(me.scope === 'template'){
                
                return readTextFile(me.path) ;
            }  
        }

        return super.caller ;
    }
}

exports.BinCode = CompilerBinCode ;

class CompilerSourceCode extends SourceCode{

    get code(){

        let me = this ;

        if(me.isFile){

            if(me.scope === 'config'){
    
                return require(me.path) ;
            }
        }

        return super.code ;
    }
}

exports.SourceCode = CompilerSourceCode ;