module.exports = paths =>{
    
    return `libraries = [${paths.map(generate).join(',')}] ;` ;
}

function generate(path){

    return `require('${path}')` ;
}