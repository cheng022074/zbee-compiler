const {
    join
} = require('path'),
{
    readJSONFile
} = require('./fs'),
{
    defineProperties
} = require('./object');

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

exports.DEFAULT_SCOPE = 'src' ;