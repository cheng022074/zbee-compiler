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
} =  require('path');

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
    }
}) ;

exports.get = key =>{

    return get(exports.PROPERTIES , key) ;
}

exports.SCOPE_FOLDERS = exports.get('scope.folders') ;

exports.DEFAULT_SCOPE = exports.get('scope.default') ;