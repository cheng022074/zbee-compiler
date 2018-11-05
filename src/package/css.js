const 
getBinList = require('./list/bin'),
{
    simpleCSSObject:isObject
} = require('../is');

module.exports = (codes , path) =>{

    let list = getBinList(codes) ;

    return {
        [`${path}.scss`]:getData(list)
    } ;
}

function getData(list){

    let result = [];

    for(let data of list){

        if(isObject(data)){

            result.push(data.data) ;
        }
    }

    return result.join('\n') ;
}