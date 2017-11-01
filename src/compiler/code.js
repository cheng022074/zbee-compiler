const {
    SourceCode,
    BinCode
} = require('../../code') ;

class CompilerBinCode extends BinCode{

    get caller(){

        let  {
            path,
            scope
        } = this.config ;

        switch(scope){
    
            case 'template':
    
                return readTextFile(path) ;
        }

        return super.caller ;
    }
}

exports.BinCode = CompilerBinCode ;

class CompilerSourceCode extends SourceCode{

    toString(){

        let {
            path,
            scope
        } = this.config ;
        
        switch(scope){
    
            case 'config':
    
                return require(path) ;
        }

        return super.toString() ;
    }
}

exports.SourceCode = CompilerSourceCode ;