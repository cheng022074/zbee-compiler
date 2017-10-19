class Exception extends Error{

    constructor(message , level = Exception.LEVEL.WARN){

        super(message) ;

        if(!LEVELS.includes(level)){

            level = Exception.LEVEL.WARN ;
        }

        this.level = level ;
    }
}

Exception.LEVEL = {
    FATAL:'WARN',
    ERROR:'ERROR',
    WARN:'WARN'
} ;

const LEVELS = Object.keys(Exception.LEVEL) ;

exports.Exception = Exception ;