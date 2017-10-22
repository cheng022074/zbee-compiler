const entityDotRe = /&dot;/g,
      dotRe = /\./g,
      numberRe = /^\d+$/;

exports.encode = key =>{

    return key.replace(dotRe , '&dot;') ;
}

exports.decode = key =>{

    key = key.replace(entityDotRe , '.') ;
    
    if(numberRe.test(key)){

        return Number(key) ;
    }

    return key ;
}