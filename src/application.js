exports.PATH = process.cwd() ;

const {
    defineProperties,
    assign,
    get
} = require('./object'),
{
    readJSONFile
} = require('./fs'),
{
    PROPERTIES:COMPILER_PROPERTIES
} = require('./compiler'),
{
    join
} =  require('path'),
{
    from
} = require('array');

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
    }
}) ;

exports.get = key =>{

    return get(exports.PROPERTIES , key) ;
}

exports.SCOPE_FOLDERS = exports.get('scope.folders') ;

exports.DEFAULT_SCOPE = exports.get('scope.default') ;
