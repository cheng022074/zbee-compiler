module.exports = params =>{

    return params.map(generate).join(',') ;
}

function generate(param){

    let {
        name,
        defaultValue,
        rest
    } = param ;

    if(defaultValue){

        return `${name}=${defaultValue}` ;
    
    }else if(rest === true){

        return `...${name}` ;
    }

    return name ;
}