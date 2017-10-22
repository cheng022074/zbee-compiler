exports.PATH = process.cwd() ;

const {
    defineProperties,
    assign,
    get
} = require('./object'),
{
    readJSONFile,
    readTextFile,
    readXMLFile
} = require('./fs'),
{
    PROPERTIES:COMPILER_PROPERTIES,
    getBinCode
} = require('./compiler'),
{
    join
} =  require('path'),
{
    from
} = require('./array'),
{
    file:is_file,
    function:is_function,
    string:is_string,
    simpleObject:is_simple_object
} = require('./is'),
{
    CommandNotFunctionExcepition,
    BinCodeFileNotFoundException,
    BindCodeFileNotExecutedException
} = require('./application/exception');

defineProperties(exports , {

    PROPERTIES:{

        once:true,

        get:() =>{

            let properties = readJSONFile(join(exports.PATH , 'properties.json'));

            if(properties){

                return assign({} , COMPILER_PROPERTIES , properties) ;
            }

            return COMPILER_PROPERTIES ;
        }
    },

    SCOPE_SUFFIXES:{

        once:true,

        get:() =>{

            let suffixes =  exports.get('scope.suffixes'),
                names = Object.keys(suffixes),
                result = {};

            for(let name of names){

                result[name] = from(suffixes[name]) ;
            }

            return result ;
        }
    },

    LIBRARIES:{

        once:true,

        get:() =>{

            let libraryPaths = from(exports.get('libraries')),
                rootPath = exports.PATH,
                libraries = [];

            for(let libraryPath of libraryPaths){

                let path = join(rootPath , libraryPath) ;

                if(is_file(path)){

                    libraries.push(require(path)) ;
                }
            }

            return libraries ;
        }
    },

    COMMAND_CODE_NAMES:{

        once:true,

        get:() =>{

            let commands = exports.get('command'),
                names = Object.keys(commands),
                result = {};

            for(let name of names){

                let command = commands[name] ;

                if(is_string(command)){

                    result[name] = command ;

                }else if(is_simple_object(command)){

                    result[name] = command.implement ;
                }
            }

            return result ;
        }
    },

    COMMAND_NAMES:{

        once:true,

        get:() =>{

            return Object.keys(exports.COMMAND_CODE_NAMES) ;
        }
    }

}) ;

exports.get = key =>{

    return get(exports.PROPERTIES , key) ;
}

exports.SCOPE_FOLDERS = exports.get('scope.folders') ;

exports.DEFAULT_SCOPE = exports.get('scope.default') ;

require('./mixins/scope')(exports) ;

exports.getBinCode = codeName =>{

    let config = exports.parseSourceCodeName(codeName) ;

    if(config){

        let {
            scope,
            name,
            path
        } = config ;

        switch(scope){

            case 'config':

                return readJSONFile(path) ;

            case 'template':

                return readTextFile(path) ;
        }
        
        path = join(exports.SCOPE_PATHS[exports.get('scope.bin')] , scope , `${name}.js`) ;
        
        if(is_file(path)){
    
            return require(path) ;
        }
    }
    
    let libraries = exports.LIBRARIES ;

    for(let library of libraries){

        if(library.hasOwnProperty(codeName)){

            return library[codeName] ;
        }
    }

    return getBinCode(codeName) ;
}

exports.executeBinCode = (codeName , ...args) =>{

    let binCode = exports.getBinCode(codeName) ;

    if(binCode){

        if(is_function(binCode)){

            return binCode(...args) ;
        
        }else{

            throw new BindCodeFileNotExecutedException(codeName) ;
        }

    }else{

        throw new BinCodeFileNotFoundException(codeName) ;
    }
}

exports.executeCommand = (command , ...args) =>{

    let commandCodeNames = exports.COMMAND_CODE_NAMES ;

    if(commandCodeNames.hasOwnProperty(command)){

        return exports.executeBinCode(commandCodeNames[command] , ...args) ;
    
    }else{

        throw new CommandNotFunctionExcepition(command) ;
    }
}

let baseSuffixRe = /\.[^\.]+$/ ;

exports.getSourceCode = name =>{

    let config = exports.parseSourceCodeName(name) ;

    if(config){

        let {
            path,
            suffix,
            scope
        } = config ;
        
        switch(scope){
    
            case 'src':
    
                switch(suffix.match(baseSuffixRe)[0]){
    
                    case '.json':
    
                        return readJSONFile(path , false) ;
    
                    case '.xml':
    
                        return readXMLFile(path , false) ;
    
                    default:
    
                        return readTextFile(path , false) ;
                }
    
            case 'template':
    
                return readTextFile(path , false) ;
    
            case 'config':
    
                return require(path) ;
        }
    }
}
