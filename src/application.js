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
    PROPERTIES:COMPILER_PROPERTIES
} = require('./compiler'),
{
    join
} =  require('path'),
{
    from
} = require('array'),
{
    file:is_file
} = require('./is');

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

require('./mixins/scope')(exports) ;

exports.getBinCode = codeName =>{
    
    let path = join(exports.SCOPE_PATHS[exports.get('scope.bin')] , `${codeName}.js`) ;

    if(is_file(path)){

        return require(path) ;
    }
}

let baseSuffixRe = /\.[^\.]+$/ ;

target.getSourceCode = name =>{
    
    let {
        path,
        suffix,
        scope
    } = exports.parseSourceCodeName(name) ;
    
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
