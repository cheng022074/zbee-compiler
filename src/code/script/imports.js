module.exports = imports =>{
    
    return imports.map(generate).join('\n') ;
}

function generate(target){

    let {
        var:varName,
        require
    } = target ;

    return `const ${varName} = include('${require}') ;` ;
}