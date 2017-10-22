const {
    ResourceException
} = require('../exception') ;

class BinCodeFileNotFoundException extends ResourceException{

    constructor(name){

        super(name , '执行文件不存在') ;
    }
}

exports.BinCodeFileNotFoundException = BinCodeFileNotFoundException ;

class CommandNotFoundExcepition extends ResourceException{

    constructor(name){

        super(name , '命令不存在') ;
    }
}

exports.CommandNotFoundExcepition = CommandNotFoundExcepition ;

class ConfigNotFoundException extends ResourceException{

    constructor(name){

        super(name , '配置不存在') ;
    }
}

exports.ConfigNotFoundException = ConfigNotFoundException ;