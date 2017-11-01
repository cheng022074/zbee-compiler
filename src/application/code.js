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
    file:is_file
} = require('../is'),
{
    join
} = require('path'),
baseSuffixRe = /\.[^\.]+$/,
{
    BIN_PATH,
    LIBRARIES
} = require('../application');

class ApplicationBinCode extends BinCode{

    get caller(){

        let me = this;

        if(me.isFile){

            let path = me.path;
            
            switch(me.scope){
    
                case 'config':
    
                    return readJSONFile(path) ;
    
                case 'template':
    
                    return readTextFile(path) ;
            }
    
            path = join(BIN_PATH , me.scope , `${me.name}.js`) ;
    
            if(is_file(path)){
    
                return require(path) ;
            }
        }
    }
}

exports.BinCode = ApplicationBinCode ;

class LibraryBinCode extends BinCode{

    get caller(){

        let me = this,
        {
            isFile
        } = me ;

        if(!isFile){

            let {
                fullName
            } = me ;

            for(let library of LIBRARIES){
        
                if(library.hasOwnProperty(fullName)){
        
                    return library[fullName] ;
                }
            }
        }
    }
}

exports.LibraryBinCode = LibraryBinCode ;

class ApplicationSourceCode extends SourceCode{

    get code(){

        let me = this ;

        if(me.isFile){

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
}

exports.SourceCode = ApplicationSourceCode ;