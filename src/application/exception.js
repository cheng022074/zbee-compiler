const {
    ResourceException
} = require('../exception') ;

class BinCodeFileNotFoundException extends ResourceException{

    constructor(name){

        super(name , '执行文件不存在') ;
    }
}

exports.BinCodeFileNotFoundException = BinCodeFileNotFoundException ;

class BindCodeFileNotExecutedException extends ResourceException{

    constructor(name){

        super(name , '执行文件无法执行') ;
    }
}

exports.BindCodeFileNotExecutedException = BindCodeFileNotExecutedException ;

class CommandNotFoundExcepition extends ResourceException{

    constructor(name){

        super(name , '命令不存在') ;
    }
}

exports.CommandNotFoundExcepition = CommandNotFoundExcepition ;