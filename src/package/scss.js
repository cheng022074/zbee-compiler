const 
getBinMap = require('./map/bin'),
{
    simpleObject:isObject
} = require('../is');

module.exports = (codes , path) =>{

    let map = getBinMap(codes) ;

    return {
        [`${path}.scss`]:getData(map)
    } ;
}

function getData(map){

    let names = Object.keys(map),
        result = [];

    for(let name of names){

        let data = map[name] ;

        if(isObject(data) && data.type === 'scss' && data.hasOwnProperty('data')){

            result.push(data.data) ;
        }
    }

    return result.join('\n') ;
}