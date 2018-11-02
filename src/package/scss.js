const 
getBinList = require('./list/bin'),
{
    simpleObject:isObject
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

        if(isObject(data) && data.type === 'scss' && data.hasOwnProperty('data')){

            result.push(data.data) ;
        }
    }

    return result.join('\n') ;
}