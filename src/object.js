const {
    empty:is_empty,
    object:is_object,
    iterable:is_iterable
} = require('./is') ;

const entityDotRe = /&dot;/g,
      dotRe = /\./g;

function encode(key){

    return key.replace(dotRe , '&dot;') ;
}

exports.keyJoin = (...keys) =>{

    let result = [] ;

    for(let key of keys){

        result.push(encode(key)) ;
    }

    return result.join('.') ;
} ;

function decode(key){

    return key.replace(entityDotRe , '.') ;
}

exports.get = (data , key) =>{

    if(is_empty(key) || key === '.'){
    
        return data ;
    }

    if(data.hasOwnProperty(key)){

        return data[key] ;
    }
        
    let keys = key.split('.') ;
    
    key = decode(keys[keys.length - 1]) ;
    
    keys.pop() ;
    
    let value = data;
    
    for(let key of keys){
    
        value = value[decode(key)] ;
    
        if(!is_object(value)){
    
            return ;
        }
    
    }
    
    return value[key] ;
}

function get_keys(data , rootKey = ''){

    if(is_object(data)){

        let keys = Object.keys(data),
            result = [];

        for(let key of keys){

            result.push(...get_keys(data[key] , `${rootKey}${encode(key)}.`)) ;
        }

        return result ;

    }
    
    if(is_iterable(data)){

        let len = data.length,
            result = [];

        for(let i = 0 ; i < len ; i ++){

            result.push(...get_keys(data[i] , `${rootKey}${i}.`)) ;
        }

        return result ;
    }

    return [
        rootKey.replace(/\.$/ , '')
    ] ;
}

exports.keys = get_keys ;