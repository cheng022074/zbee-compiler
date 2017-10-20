const Exception = require('../exception'),
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
    simpleObject:is_simple_object
} = require('../is');

class CommandNotFoundException extends Exception{

    constructor(command){

        super(`命令 ${command} 不存在`) ;

        this.command = command ;
    }
}

exports.CommandNotFoundException = CommandNotFoundException ;

class Command{

    constructor(command){

        let path = searchFilePath(join(__dirname , '..' , '..' ,  'command' , `${command}`) , '.js') ;

        if(!path){

            throw new CommandNotFoundException(command) ;
        }

        let me = this ;

        me.name = command ;

        me.command = require(path) ;

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