const {
    get:object_get
} = require('./object') ;

function get(name , key){

    return object_get(require(`../config/${name}`) , key) ;
}

exports.get = (name , key) =>{

    return get(name , key) ;
}