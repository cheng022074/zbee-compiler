const {
    Exception,
    ModuleNotFoundException
} = require('../exception'),
{
    searchFilePath
} = require('../fs'),
{
    join:join
} = require('path'),
{
    execute
} = require('../script'),
{
    defined:is_defined,
    simpleObject:is_simple_object,
    file:is_file
} = require('../is'),
{
    replace
} = require('../path/suffix'),
{
    toPath
} = require('../name');

class Command{

    constructor(name){

        let path = replace(join(__dirname , '..' , '..' ,  'command' , `${toPath(name)}`) , '.js') ;

        if(!is_file(path)){

            throw new ModuleNotFoundException(path) ;
        }

        this.command = require(path) ;
    }

    execute(argv){

        let result = execute(this.command , argv) ;

        if(result instanceof Promise){

            result.then(output_result).catch(throw_error) ;

        }else{

            output_result(result) ;
        }
    }
}

function output_result(result){

    if(is_defined(result)){

        if(is_simple_object(result)){

            console.log(json_format(result)) ;
        
        }else{

            console.log(result) ;
        }
    }
}

function throw_error(err){

    throw err ;
}

exports.Command = Command;