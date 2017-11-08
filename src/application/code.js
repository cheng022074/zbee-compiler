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
{
    require:module_require
} = require('../module');

class ApplicationBinCode extends BinCode{

    generateCaller(){

        let me = this;

        if(me.isFile){

            let path = me.path;

            switch(me.scope){

                case 'template':

                    return readTextFile(path) ;

                case 'config':

                    return readJSONFile(path) ;

                case 'test':

                    if(me.suffix === '.json'){

                        return readJSONFile(path) ;
                    }
            }

            path = join(this.project.BIN_PATH , me.scope , `${me.name}.js`) ;
    
            if(is_file(path)){
    
                return module_require(path) ;
            }
        }
    }
}

exports.BinCode = ApplicationBinCode ;

class LibraryBinCode extends BinCode{

    generateCaller(){

        let me = this,
        {
            isFile
        } = me ;

        if(!isFile){

            let {
                fullName
            } = me ;

            let libraries = me.project.LIBRARIES ;

            for(let library of libraries){

                let {
                    include
                } = library ;
        
                if(include){
        
                    return include(fullName) ;
                
                }
            }
        }
    }
}

exports.LibraryBinCode = LibraryBinCode ;

class ApplicationSourceCode extends SourceCode{
}

exports.SourceCode = ApplicationSourceCode ;