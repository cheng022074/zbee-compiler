const dotRe = /\./g ;

exports.toPath = (name , suffix = '.js') =>{

    return `${name.replace(dotRe , '/')}${suffix}` ;
}