exports.defined = data =>{

    return data !== undefined ;
}

exports.array = data =>{

    return Array.isArray(data) ;
}

const iterableRe = /\[object\s*(?:Array|Arguments|\w*Collection|\w*List|HTML\s+document\.all\s+class)\]/,
      {
          toString
      } = Object.prototype;

exports.iterable = data =>{

    if (!data || !exports.number(data.length) || exports.string(data) || exports.function(data) || exports.class(data)) {

        return false;
    }

    if (!data.propertyIsEnumerable) {

        return !!data.item;
    }

    if (data.hasOwnProperty('length') && !data.propertyIsEnumerable('length')) {

        return true;
    
    }

    return iterableRe.test(toString.call(data));
}

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

exports.emptyDirectory = path =>{

    return !(exports.directory(path) && readdirSync(path).length !== 0) ;
}

function is_type(data , type){

    return typeof data === type ;
}

exports.empty = data =>{

    return data === null || data === undefined || data === '' || data.length === 0;
}

exports.object = data =>{

    return toString.call(data) === '[object Object]' ;
}

exports.simpleObject = data =>{

    return data instanceof Object && data.constructor === Object;
}

exports.string = data =>{

    return is_type(data , 'string') ;
}

exports.number = data =>{

    return is_type(data , 'number') ;
}

exports.boolean = data =>{

    return is_type(data , 'boolean') ;
}

const classRe = /^class/ ;

exports.function = data =>{

    return is_type(data , 'function') && !classRe.test(data.toString());
}

exports.class = data =>{

    return is_type(data , 'function') && classRe.test(data.toString());
}

exports.primitive = data =>{

    let type = typeof data ;
    
    return type === 'string' || type === 'number' || type === 'boolean';
}

exports.htmlDocument = data =>{

    return toString.call(data) === '[object Document]' ;
}

exports.htmlElement = data =>{

    return data ? data.nodeType === 1 : false ;
}