const scopeRe = /^(?:(\w+)\:{2})?(\w+(?:\.\w+)*)$/,
      nameRe = /^(?:\w+\:{2})?\w+(?:\.\w+)*$/;

exports.valid = name =>{

    return nameRe.test(name) ;
}

exports.parse = name =>{

    if(!exports.valid(name)){

        return false ;
    }

    let match = name.match(scopeRe) ;

    if(match){

        let scope = match[1].trim() ;

        return {
            scope:scope,
            name:match[2].trim()
        } ;
    }

    return {
        name
    } ;
}