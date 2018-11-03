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

function isSimpleObject(data){

    return data instanceof Object && data.constructor === Object;
}

exports.simpleObject = isSimpleObject ;

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

exports.defined = data =>{

    return data !== undefined ;
}

function isSimpleTypeObject(data , type){

    return isSimpleObject(data) && data.type === type && typeof data.data === 'string' ;
}

exports.simpleHTMLObject = data =>{

    return isSimpleTypeObject(data , 'html') ;
}

exports.simpleCSSObject = data =>{

    return isSimpleTypeObject(data , 'css') ;
}