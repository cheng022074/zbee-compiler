const {
    simpleObject:isObject,
    string:isString
} = require('../is'),
{
    parse
} = require('date-and-time');

exports.string = data =>{

    return data ;
}

exports.boolean = data =>{

    return Boolean(data) ;
}

exports.number = data =>{

    return Number(data) ;
}

exports.date = (data , {
    format = 'YYYY-MM-DD HH:mm:ss'
} = {}) =>{

    return parse(data , format) ;
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