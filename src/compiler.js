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
    src:'src',
    config:'config',
    template:'template'
} ;

exports.DEFAULT_SCOPE = 'src' ;

exports.SCOPE_SUFFIXES = {
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
    
    let {
        path,
        scope
    } = exports.parseSourceCodeName(name) ;
    
    switch(scope){

        case 'src':
        case 'config':

            return require(path) ;

        case 'template':

            return readTextFile(path , false) ;
    }
}

target.getSourceCode = name =>{
    
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

