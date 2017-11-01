const {
    SourceCode,
    BinCode
} = require('../code'),
{
    readJSONFile,
    readHTMLFile,
    readXMLFile
} = require('../fs'),
{
    join
} = require('path'),
baseSuffixRe = /\.[^\.]+$/,
{
    BIN_PATH,
    LIBRARIES
} = require('../application');

class ApplicationBinCode extends BinCode{

    get binPath(){

        let me = this ;

        return join(BIN_PATH , me.scope , `${me.name}.js`) ;
    }

    get caller(){

        let me = this,
            path = me.path;

        switch(me.scope){

            case 'config':

                return readJSONFile(path) ;

            case 'template':

                return readTextFile(path) ;
        }

        return super.caller ;
    }
}

exports.BinCode = ApplicationBinCode ;

class LibraryBinCode{
    
    constructor(codeName){

        
    }

    get caller(){

        
    }
}

exports.LibraryBinCode = LibraryBinCode ;

class ApplicationSourceCode extends SourceCode{

    get code(){

        let me = this ;

        if(me.scope === 'template'){

            return super.code ;
        }

        let path = me.path ;

        switch(suffix.match(baseSuffixRe)[0]){
            
            case '.json':

                return require(path) ;

            case '.xml':

                return readXMLFile(path) ;

            case '.html':

                return readHTMLFile(path) ;
        }

        return super.code ;
    }
}

exports.SourceCode = ApplicationSourceCode ;