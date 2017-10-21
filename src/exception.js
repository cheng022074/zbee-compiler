class Exception extends Error{
}

exports.Exception = Exception ;

class NotFoundException extends Exception{

    constructor(name , message){

        super(`${name} ${message}`) ;

        this.resourceName = name ;
    }
}

exports.NotFoundException = NotFoundException ;