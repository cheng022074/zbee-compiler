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
    statSync
} = require('fs') ;

exports.file = path =>{

    return path && existsSync(path) && statSync(path).isFile() ;
}

exports.directory = path =>{

    return path && existsSync(path) && statSync(path).isDirectory() ;
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

exports.recordset = recordset =>{

    if(exports.array(recordset)){

        const is_simpleObject = exports.simpleObject ;

        for(let record of recordset){

            if(!is_simpleObject(record)){

                return false ;
            }
        }

        return true ;
    }

    return false ;
}