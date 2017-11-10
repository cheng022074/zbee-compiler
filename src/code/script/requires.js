module.exports = requires =>{
    
    return requires.map(generate).join('\n') ;
}

function generate(target){

    let {
        var:varName,
        require
    } = target ;

    if(varName){

        return `const ${varName} = require('${require}') ;` ;
    }

    return '' ;
}