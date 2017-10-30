const {
    join
} = require('path'),
{
    readJSONFile
} = require('./fs'),
{
    defineProperties,
    get
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
    },

    DEPENDENCIES:{

        once:true,

        get:() =>{

            let {
                dependencies
            } = exports.PACKAGE,
            moduleNames = Object.keys(dependencies),
            result = {};

            for(let moduleName of moduleNames){

                result[moduleName] = require(moduleName) ;
            }

            return result ;
        }
    },

    VERSION:{

        once:true,

        get:() =>{

            return exports.get('version') ;
        }
    }
}) ;

exports.get = key =>{
    
    return get(exports.PACKAGE , key) ;
}

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
        '.html',
        '.js',
        '.json',
        '.md'
    ]
} ;

require('./mixin/scope')(exports) ;

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

