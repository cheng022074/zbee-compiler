const {
    defineProperties,
    assign,
    get
} = require('./object'),
{
    readJSONFile,
    readTextFile,
    readXMLFile,
    readHTMLFile
} = require('./fs'),
{
    join
} =  require('path'),
{
    from
} = require('./array'),
{
    file:is_file,
    function:is_function,
    string:is_string
} = require('./is'),
{
    CommandNotFoundExcepition,
    BinCodeFileNotFoundException
} = require('./application/exception'),
{
    SourceCode,
    BinCode,
    LibraryBinCode
} = require('./application/code'),
Project = require('./project'),
compiler = require('./compiler'),
Config = require('./application/config');

class Application extends Project{

    constructor(){

        super() ;

        let me = this ;

        me.PATH = process.cwd() ;

        me.CONFIG = new Config(me) ;

        me.COMPILER = compiler ;
    }

    get(key){

        return get(this.PROPERTIES , key) ;
    }

    generateBinCode(config){
        
        let me = this ;

        if(config){

            if(config.hasOwnProperty('path')){
    
                return new BinCode(me , config) ;
            
            }else{
    
                let code = new LibraryBinCode(me , config) ;
    
                if(code.caller){
    
                    return code ;
                }
            }

            let {
                scope,
                name
            } = config ;

            return compiler.getBinCode(`${scope}::${name}`) ;
        }
    }
 
    executeBinCode(codeName , ...args){
        
        let binCode = this.getBinCode(codeName) ;
    
        if(binCode){
    
            let caller = binCode.caller ;

            if(is_function(caller)){
        
                return caller(...args) ;
            
            }
    
        }else{
    
            throw new BinCodeFileNotFoundException(codeName) ;
        }
    }
        
    executeCommand(command , ...args){
        
        let me = this,
            commandCodeNames = me.COMMAND_CODE_NAMES ;
    
        if(commandCodeNames.hasOwnProperty(command)){
    
            return me.executeBinCode(`command::${commandCodeNames[command]}` , ...args) ;
        
        }else{
    
            throw new CommandNotFoundExcepition(command) ;
        }
    }
        
    generateSourceCode(config){
    
        let me = this ;
    
        if(config){
    
            return new SourceCode(me , config) ;
        }
    }

    config(name , key){

        return this.CONFIG.get(name , key) ;
    }
}

defineProperties(Application.prototype , {

    PROPERTIES:{

        get(){

            let properties = readJSONFile(join(this.PATH , 'properties.json'));

            if(properties){

                return assign({} , compiler.PROPERTIES , properties) ;
            }

            return compiler.PROPERTIES ;
        }
    },

    SCOPE_SUFFIXES:{

        get(){

            let suffixes =  this.get('scope.suffixes'),
                names = Object.keys(suffixes),
                result = {};

            for(let name of names){

                result[name] = from(suffixes[name]) ;
            }

            return result ;
        }
    },

    LIBRARY_PATHS:{

        get(){

            let me = this,
                libraryPaths = from(me.get('libraries')),
                rootPath = me.LIBRARY_PATH,
                paths = [];

            for(let libraryPath of libraryPaths){

                let path = join(rootPath , libraryPath) ;

                if(is_file(path)){

                    paths.push(path) ;
                }
            }

            return paths ;
        }
    },

    LIBRARIES:{

        get(){

            let result = [] ;

            for(let path of this.LIBRARY_PATHS){

                result.push(require(path)) ;
            }

            return result ;
        }
    },

    COMMAND_CODE_NAMES:{

        get(){

            let commands = this.get('command'),
                names = Object.keys(commands),
                result = {};

            for(let name of names){

                let command = commands[name] ;

                if(is_string(command)){

                    result[name] = command ;

                }
            }

            return result ;
        }
    },

    COMMAND_NAMES:{

        get(){

            return Object.keys(this.COMMAND_CODE_NAMES) ;
        }
    },

    LIBRARY_PATH:{

        get(){

            let me = this ;

            return join(me.PATH , me.get('path.lib')) ;
        }
    },

    BIN_PATH:{

        get(){

            let me = this ;

            return join(me.PATH , me.get('path.bin')) ;
        }
    },

    DIST_PATH:{

        get(){

            let me = this ;

            return join(me.PATH , me.get('path.dist')) ;
        }
    },

    SCOPE_FOLDERS:{

        get(){

            return this.get('scope.folders') ;
        }
    },

    DEFAULT_SCOPE:{

        get(){

            return this.get('scope.default') ;
        }
    }
}) ;

module.exports = new Application() ;