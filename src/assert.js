const {
    simpleObject:is_simpleObject,
    array:is_array,
    iterable:is_iterable,
    number:is_number,
    primitive:is_primitive,
    recordset:is_recordset
} = require('./is'),
{
    AssertionError,
    deepEqual,
    deepStrictEqual,
    equal,
    strictEqual
} = require('assert'),
{
    keys:get_keys,
    get:object_keys
} = require('./object'),
{
    from:array_from
} = require('./array');

exports.length = (actual , expected) =>{

    if(!is_iterable(actual)){

        throw new AssertionError({
            message:`实际数据不是迭代类型`
        }) ;
    }

    if(is_number(expected)){

        let length = actual.length ;

        equal(length , expected , message || `迭代长度与预期不符 , 实际长度: ${length}, 预期长度: ${expected}`) ;
    }
}

function deepEqual(actual , expected , equalFn){

    if(is_primitive(actual)){

        deepEqual(actual , expected , message) ;
    
    }else{

        let keys = get_keys(actual , true) ;

        for(let key of keys){

            let actualValue = object_key(actual , key),
                expectedValue = object_key(expected , key) ;

            equalFn(actualValue , expectedValue , message || `键名称为 ${key} 的值与预期不符 , 实际值: ${actualValue} , 预期值: ${expectedValue}`) ;
        }
    }
}

exports.deepEqual = (actual , expected) =>{

    return deepEqual(actual , expected , equal) ;
} ;

exports.deepStrictEqual = (actual , expected) =>{
    
    return deepEqual(actual , expected , strictEqual) ;
} ;

function includes(actual , expected , equalFn){

    if(is_recordset(actual)){
        
        throw new AssertionError({
            message:'实际数据不是记录集类型'
        }) ;
    }

    if(is_simpleObject(expected)){
        
        throw new AssertionError({
            message:'预期数据不是记录类型'
        }) ;
    }

    try{

        for(let record of actual){

            equalFn(record , expected) ;
        }

    }catch(err){

        throw new AssertionError({
            message:`预期数据在实际数据中不存在`
        }) ;
    }
}

exports.includes = (actual , expected) =>{

    includes(actual , expected , exports.deepEqual) ;
} ;

exports.strictIncludes = (actual , expected) =>{
    
    includes(actual , expected , exports.deepStrictEqual) ;
} ;

exports.completeIncludes = (actual , expected) =>{

    includes(actual , expected , deepEqual) ;
}

exports.strictCompleteIncludes = (actual , expected) =>{

    includes(actual , expected , deepStrictEqual) ;
}

function recordsetEqual(actual , expected , includesFn){

    if(is_recordset(actual)){

        throw new AssertionError({
            message:'实际数据不是记录集类型'
        }) ;
    }

    if(is_simpleObject(expected)){

        expected = array_from(expected) ;
    }

    if(is_recordset(expected)){
        
        throw new AssertionError({
            message:'预期数据不是记录集类型'
        }) ;
    }

    let len = expected.length ;

    for(let i = 0 ; i < len ; i ++){

        try{

            includesFn(actual , expected[i]) ;

        }catch(err){

            continue ;
        }

        return ;
    }

    throw new AssertionError({
        message:'预期数据在实际数据中不存在'
    }) ;
}

exports.recordsetEqual = (actual , expected) =>{

    recordsetEqual(actual , expected , exports.includes) ;
}

exports.strictRecordsetEqual = (actual , expected) =>{

    recordsetEqual(actual , expected , exports.strictIncludes) ;
}

exports.completeRecordsetEqual = (actual , expected) =>{

    recordsetEqual(actual , expected , exports.completeIncludes) ;
}

exports.strictCompleteRecordsetEqual = (actual , expected) =>{

    recordsetEqual(actual , expected , exports.strictCompleteIncludes) ;
}