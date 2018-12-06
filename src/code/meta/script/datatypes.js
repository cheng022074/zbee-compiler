const datatypeRe = /|/ ;

module.exports = data =>{

    let types = data.split(datatypeRe),
        len = types.length;

    for(let i = 0 ; i < len ; i ++){

        types[i] = types[i].trim() ;
    }

    return types ;
}