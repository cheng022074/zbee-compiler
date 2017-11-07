module.exports = params =>{

    return params.map(generate).join(',') ;
}

function generate(param){

    let {
        name,
        defaultValue
    } = param ;

    if(defaultValue){

        return `${name}=${defaultValue}` ;
    }

    return name ;
}