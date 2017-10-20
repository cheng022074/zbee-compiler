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

    PROPERTIES:{

        once:true,

        get:() =>{

            return readJSONFile(join(exports.PATH , 'package.json')) ;
        }
    }
}) ;