const {
    NotFoundException
} = require('../exception') ;

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