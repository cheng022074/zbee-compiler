const dotRe = /\./g ;

const parse = require('./parse') ;

module.exports = (fullName , useFolderPrefix) => {

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

    if(useFolderPrefix && process.env[`ZBEE-PARAM-${folder}-PREFIX`]){

        name = `${useFolderPrefix || folder}-${name}` ;
    
    }else{

        name = `${folder}-${name}` ;
    }

    return name.toLowerCase() ;    
}