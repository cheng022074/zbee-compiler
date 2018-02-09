class Exception extends Error{
}

class TargetException extends Exception{

    constructor(name , message , title){

        let me = this ;

        me.name = name,
        me.message = message,
        me.title = title ;

        if(title){

            super(`${title}:${name} ${message}`) ;
        
        }else{

            super(`${name} ${message}`) ;
        }
    }
}

{
    class NotDefinedException extends TargetException{

        constructor(name , message = '未定义' , title){
    
            super(name , message , title) ;
        }
    }
    
    exports.NotDefinedException = NotDefinedException ;
    
    class NotFoundException extends TargetException{
    
        constructor(title , message = '未找到'){
    
            super(title , message) ;
        }
    }
    
    exports.NotFoundException = NotFoundException ;
}