const {
    SourceCode,
    BinCode
} = require('../code'),
{
    readTextFile
} = require('../fs'),
{
    require:module_require
} = require('../module');

class CompilerBinCode extends BinCode{

    generateCaller(){

        let me = this ;

        if(me.isFile){

            if(me.scope === 'template'){
                
                return readTextFile(me.path) ;
            }  
        }

        return super.generateCaller() ;
    }
}

exports.BinCode = CompilerBinCode ;

class CompilerSourceCode extends SourceCode{

    generateCode(){

        let me = this ;

        if(me.isFile){

            if(me.scope === 'config'){
    
                return module_require(me.path) ;
            }
        }

        return super.generateCode() ;
    }
}

exports.SourceCode = CompilerSourceCode ;