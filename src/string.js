exports.capitalize = data =>{

    return `${data.charAt(0).toUpperCase()}${data.substr(1)}` ;
}

exports.split = (data , splitRe) =>{

    return data.split(splitRe).filter(value => value.trim() !== '') ;
}