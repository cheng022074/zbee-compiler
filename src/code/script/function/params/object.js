module.exports = params =>{
    
    return `{${process(params).map(generate).join(',')}}` ;
}

const keyRe = /^(?:[^\.]+)\.(?:[^\.]+)$/ ;

function process(params){

    let result = [] ;

    for(let param of params){

        let {
            name
        } = param ;

        if(!keyRe.test(name)){

            result.push(param) ;
        }
    }

    return result ;
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