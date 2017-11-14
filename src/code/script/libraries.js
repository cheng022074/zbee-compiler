module.exports = paths =>{

    let result = [] ;

    for(let path of paths){

        result.push(`require('${path}')`) ;
    }

    return `[${result.join(',')}]` ;
}