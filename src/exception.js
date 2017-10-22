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