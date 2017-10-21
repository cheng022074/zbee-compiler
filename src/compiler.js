const {
    join
} = require('path'),
{
    readJSONFile
} = require('./fs'),
{
    defineProperties
} = require('./object'),
{
    readTextFile
} = require('./fs');

exports.PATH = join(__dirname , '..') ;

defineProperties(exports , {
    
    PROPERTIES:{

        once:true,

        get:() =>{

            return readJSONFile(join(exports.PATH , 'properties.json')) ;
        }
    },

    PACKAGE:{

        once:true,

        get:() =>{

            return readJSONFile(join(exports.PATH , 'package.json')) ;
        }
    }
}) ;

exports.SCOPE_FOLDERS = {
    command:'command',
    src:'src',
    config:'config',
    template:'template'
} ;

exports.DEFAULT_SCOPE = 'src' ;

exports.SCOPE_SUFFIXES = {
    command:[
        '.js'
    ],
    src:[
        '.js'
    ],
    config:[
        '.json'
    ],
    template:[
        '.js'
    ]
} ;

require('./mixins/scope')(exports) ;

exports.getBinCode = name =>{
    
    let config = exports.parseSourceCodeName(name) ;

    if(config){

        let  {
            path,
            scope
        } = config ;

        switch(scope){
            
            case 'src':
            case 'config':
            case 'command':
    
                return require(path) ;
    
            case 'template':
    
                return readTextFile(path , false) ;
        }
    }
}

exports.getSourceCode = name =>{
    
    let {
        path,
        scope
    } = exports.parseSourceCodeName(name) ;
    
    switch(scope){

        case 'src':
        case 'template':

            return readTextFile(path , false) ;

        case 'config':

            return require(path) ;
    }
}

