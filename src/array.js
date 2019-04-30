const {
    empty:is_empty,
    string:is_string,
    array:is_array
} = require('./is'),
{
    split
} = require('./string');

exports.replace = (data , replaceItem , item) =>{

    let index = data.indexOf(item) ;

    if(index !== -1){

        data[index] = replaceItem ;

        return true ;
    }

    return false ;
}

exports.clone = data =>{

    return data.slice() ;
} 

exports.clear = data =>{

    data.length = 0 ;
}

exports.from = data =>{

    if(is_empty(data)){

        return [];
    }

    if(data && data.length !== undefined && !is_string(data)){

        return Array.from(data) ;
    }

    return [
        data
    ] ;
}

exports.unique = data =>{
    
    return Array.from(new Set(data)) ;
}



function remove(data , item){

    let index = data.indexOf(item) ;

    if(index !== -1){

        data.splice(index , 1) ;

        return true ;
    }

    return false ;
}

exports.remove = remove ;

function removeAll(data , item){

    while(remove(data , item)) ;
}

exports.removeAll = removeAll ;

exports.clearEmpty = data =>{

    removeAll(data , '') ;

    removeAll(data , undefined) ;

    removeAll(data , null) ;

    return data ;
}

exports.push = (data , item) =>{

    const {
        from
    } = exports ;

    data.push(...from(item)) ;

}

exports.toPropertyValue = data =>{

    return data.join(' ') ;
}

const splitRe = /\s+/ ;

exports.fromPropertyValue = data =>{

    return split(data , splitRe) ;
}