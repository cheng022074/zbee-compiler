class Exception extends Error{
}

exports.Exception = Exception ;

class KeyException extends Exception{

    constructor(key , message){

        super(`${key} ${message}`) ;

        let me = this ;

        me.key = key ;
    }
}

exports.KeyException = KeyException ;

class NotDefinedException extends KeyException{

    constructor(key , message = '未定义'){

        super(key , message) ;
    }
}

exports.NotDefinedException = NotDefinedException ;

class ExistsException extends KeyException{

    constructor(key , message = '已存在'){

        super(key , message) ;
    }
}

exports.ExistsException = ExistsException ;

class TargetKeyException extends Exception{

    constructor(target , key , message){
        
        super(`${target} ${key} ${message}`) ;

        let me = this ;

        me.target = target ;

        me.key = key ;
    }
}

exports.TargetKeyException = TargetKeyException ;