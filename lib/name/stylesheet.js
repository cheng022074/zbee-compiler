const dotRe = /\./g ;

const parse = require('./parse') ;

module.exports = fullName => {

    let {
        name,
        folder
    } = parse(fullName),
    names = name.split(dotRe) ;

    let result = [] ;

    for(let name of names){

        result.push(name) ;
    }

    name = names.join('-') ;

    name = `${process.env[`ZBEE-PARAM-${folder}-PREFIX`] || folder}-${name}` ;

    return name.toLowerCase() ;    
}