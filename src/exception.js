class Exception extends Error{
}

class TargetException extends Exception{

    constructor(title , name , msg){

        super(`${title}:${name} ${msg}`) ;

        let me = this ;

        me.name = name,
        me.msg = msg,
        me.title = title ;
    }
}

{
    class NotDefinedException extends TargetException{

        constructor(name , msg = '未定义' , title){
    
            super(name , msg , title) ;
        }
    }
    
    exports.NotDefinedException = NotDefinedException ;
    
    class NotFoundException extends TargetException{
    
        constructor(title , name , msg = '未找到'){
    
            super(title , name , msg) ;
        }
    }
    
    exports.NotFoundException = NotFoundException ;
}