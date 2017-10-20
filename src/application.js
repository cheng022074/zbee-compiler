exports.PATH = process.cwd() ;

const {
    defineProperties
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
    assign,
    get
} = require('./object'),
{
    encode
} = require('./object/key'),
{
    string:is_string,
    simpleObject:is_simple_object
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

    COMMAND_NAMES:{

        once:true,

        get:() =>{

            return Object.keys(exports.PROPERTIES.command) ;
        }
    }

}) ;

exports.get = key =>{

    return get(exports.PROPERTIES , key) ;
}

exports.commandExists = name =>{

    return exports.COMMAND_NAMES.includes(name) ;
}

exports.getCommandConfig = name =>{

    if(exports.commandExists(name)){

        return exports.get(`command.${encode(name)}`) ;
    }
}

exports.getCommandImplementFunctionName = name =>{

    let config = exports.getCommandConfig(name) ;

    if(is_simple_object(config)){

        return config.implement ;
        
    }else if(is_string(config)){

        return config ;
    }
}

exports.printCommandHelpInformation = name =>{

    console.log('打印一个') ;
}

exports.printCommandHelpInformations = () =>{

    console.log('打印所有') ;
}