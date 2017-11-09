module.exports = values =>{

    let keys = Object.keys(values),
        result = [];

    for(let key of keys){

        result.push(`const ${key} = ${JSON.stringify(values[key])} ;`) ;
    }

    return result.join('\n') ;
}