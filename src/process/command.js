const {
    Exception
} = require('../exception'),
{
    searchFilePath
} = require('../fs'),
{
    join:path_join
} = require('path');

class CommandNotFoundException extends Exception{

    constructor(command){

        super(`命令 ${command} 不存在` , Exception.LEVEL.ERROR) ;

        this.command = command ;
    }
}

exports.CommandNotFoundException = CommandNotFoundException ;

class Command{

    constructor(command){

        let path = searchFilePath(path_join(__dirname , `../command/${command}`) , '.js') ;

        if(!path){

            throw new CommandNotFoundException(command) ;
        }

        this.command = require(`../command/${command}`) ;

    }

    exec(argv){


    }
}

exports.Command = Command;