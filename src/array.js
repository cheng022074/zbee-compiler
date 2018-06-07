const {
    empty:is_empty,
    string:is_string
} = require('./is') ;

exports.from = data =>{

    if(is_empty(data)){

        return [];
    }

    if (data && data.length !== undefined && !is_string(data)) {

        return Array.from(data);

    }

    return [
        data
    ];
}

exports.unique = data =>{
    
    return Array.from(new Set(data)) ;
}

exports.remove = (data , item) =>{

    let index = data.indexOf(item) ;

    if(index !== -1){

        data.splice(index , 1) ;

        return true ;
    }

    return false ;
}