const {
    simpleObject:isObject,
    string:isString,
    date:isDate
} = require('../is'),
{
    format:doFormat
} = require('date-and-time');

exports.boolean = data =>{

    return Boolean(data) ;
}

exports.number = data =>{

    return Number(data) ;
}

exports.date = (data , {
    format = 'YYYY-MM-DD HH:mm:ss'
} = {}) =>{

    return doFormat(data , format) ;
}

exports.type = (data , type) =>{

    if(isObject(type)){

        let {
            type:name,
            ...config
        } = type ;

        return exports[name](data , config) ;
    
    }else if(isString(type)){

        return exports[type](data) ;
    }
}