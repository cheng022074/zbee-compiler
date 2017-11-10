class Exception extends Error{
}

exports.Exception = Exception ;

class ResourceException extends Exception{

    constructor(name , message){

        super(`${name} ${message}`) ;

        this.resourceName = name ;
    }
}

exports.ResourceException = ResourceException ;

class NotDefinedException extends Exception{

    constructor(target , key , message = '未定义'){

        super(`${target} ${key} ${message}`) ;

        let me = this ;

        me.target = target ;

        me.key = key ;
    }
}

exports.NotDefinedException = NotDefinedException ;