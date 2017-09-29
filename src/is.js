exports.defined = data =>{

    return data !== undefined ;
}

const {
    existsSync,
    statSync
} = require('fs') ;

exports.file = path =>{

    return existsSync(path) && statSync(path).isFile() ;
}

exports.directory = path =>{

    return existsSync(path) && statSync(path).isDirectory() ;
}

function is_type(data , type){

    return typeof data === type ;
}

exports.empty = data =>{

    return data === null || data === undefined || data === '' || data.length === 0;
}

exports.object = data =>{

    return is_type(data , 'object') ;
}

exports.string = data =>{

    return is_type(data , 'string') ;
}

const classRe = /^class/ ;

exports.function = data =>{

    return is_type(data , 'function') && !classRe.test(data.toString());
}

exports.class = data =>{

    return is_type(data , 'function') && classRe.test(data.toString());
}