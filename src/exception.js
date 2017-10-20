class Exception extends Error{
}

exports.Exception = Exception ;

class ModuleNotFoundException extends Exception{

    constructor(path){

        super(`${path} 模块不存在`) ;

        this.path = path ;
    }
}

exports.ModuleNotFoundException = ModuleNotFoundException ;