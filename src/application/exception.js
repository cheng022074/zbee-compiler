const Exception = require('../exception') ;

class NotFoundException extends Exception{

    constructor(name , message){

        super(`${name} ${message}`) ;

        this.resourceName = name ;
    }
}

class BinCodeFileNotFoundException extends NotFoundException{

    constructor(name){

        super(name , '执行文件不存在') ;
    }
}

exports.BinCodeFileNotFoundException = BinCodeFileNotFoundException ;

class CommandNotFunctionExcepition extends NotFoundException{

    constructor(name){

        super(name , '命令不存在') ;
    }
}

exports.CommandNotFunctionExcepition = CommandNotFunctionExcepition ;