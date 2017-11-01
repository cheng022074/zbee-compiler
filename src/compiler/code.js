const {
    SourceCode,
    BinCode
} = require('../../code') ;

class CompilerBinCode extends BinCode{

    get caller(){

        let me = this ;

        switch(me.scope){
    
            case 'template':
    
                return readTextFile(me.binPath) ;
        }

        return super.caller ;
    }
}

exports.BinCode = CompilerBinCode ;

class CompilerSourceCode extends SourceCode{

    get code(){

        let me = this ;
        
        switch(me.scope){
    
            case 'config':
    
                return require(this.sourcePath) ;
        }

        return super.toString() ;
    }
}

exports.SourceCode = CompilerSourceCode ;