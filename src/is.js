function is_type(data , type){

    return typeof data === type ;
}

{
    const classRe = /^class/ ;

    exports.function = data =>{

        return is_type(data , 'function') && !classRe.test(data.toString());
    }

    exports.class = data =>{

        return is_type(data , 'function') && classRe.test(data.toString());
    }
}

exports.string = data =>{

    return is_type(data , 'string') ;
}

exports.array = data =>{

    return Array.isArray(data) ;
}

exports.simpleObject = data =>{

    return data instanceof Object && data.constructor === Object;
}

{
    const {
        toString
    } = Object.prototype ;
    
    exports.object = data =>{
    
        return toString.call(data) === '[object Object]' ;
    }
}

{
    const {
        existsSync,
        statSync,
        readdirSync
    } = require('fs') ;
    
    exports.file = path =>{
    
        return path && existsSync(path) && statSync(path).isFile() ;
    }
    
    exports.directory = path =>{
    
        return path && existsSync(path) && statSync(path).isDirectory() ;
    }
}

exports.empty = data =>{

    return data === null || data === undefined || data === '' || data.length === 0;
}