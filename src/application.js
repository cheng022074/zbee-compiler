exports.PATH = process.cwd() ;

const {
    defineProperties
} = require('./object'),
{
    readJSONFile
} = require('./fs'),
{
    PATH:COMPILER_PATH
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
} = require('./object/key');

defineProperties(exports , {

    PROPERTIES:{

        once:true,

        get:() =>{

            let properties = readJSONFile(join(exports.PATH , 'properties.json')),
                defaultProperties = readJSONFile(join(COMPILER_PATH , 'properties.json'));

            if(properties){

                return assign({} , defaultProperties , properties) ;
            }

            return defaultProperties ;
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

exports.printCommandHelpInformation = name =>{

    console.log('打印一个') ;
}

exports.printCommandHelpInformations = () =>{

    console.log('打印所有') ;
}