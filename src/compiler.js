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
} = require('./fs'),
{
    BinCode,
    SourceCode
} = require('./compiler/code'),
Project = require('./project');

class Compiler extends Project{

    constructor(){

        super() ;

        let me = this ;

        me.PATH = join(__dirname , '..') ;

        me.SCOPE_FOLDERS = {
            command:'command',
            src:'src',
            config:'config',
            template:'template'
        } ;
        
        me.DEFAULT_SCOPE = 'src' ;
        
        me.SCOPE_SUFFIXES = {
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
    }

    get(key){
        
        return get(this.PACKAGE , key) ;
    }

    
    generateBinCode(name){
    
        let me = this,
            config = me.parseSourceCodeName(name) ;

        if(config){

            return new BinCode(me , config) ;
        }
    }

    generateSourceCode(name){
    
        let me = this,
            config = me.parseSourceCodeName(name) ;

        if(config){

            let code = new SourceCode(me , config) ;

            if(code.isFile){

                return code ;
            }
        }
    }
}

defineProperties(Compiler.prototype , {
    
    PROPERTIES:{

        get(){

            return readJSONFile(join(this.PATH , 'properties.json')) ;
        }
    },

    PACKAGE:{

        get(){

            return readJSONFile(join(this.PATH , 'package.json')) ;
        }
    },

    DEPENDENCIES:{

        get(){

            let {
                dependencies
            } = this.PACKAGE,
            moduleNames = Object.keys(dependencies),
            result = {};

            for(let moduleName of moduleNames){

                result[moduleName] = require(moduleName) ;
            }

            return result ;
        }
    },

    VERSION:{

        get(){

            return this.get('version') ;
        }
    }
}) ;

module.exports = new Compiler() ;

