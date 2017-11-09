module.exports = params =>{

    return process(params).map(generate).join(',') ;
}

const {
    array:is_array
} = require('../../../is') ;

function generate(param){

    let {
        name,
        defaultValue,
        rest
    } = param ;

    if(is_array(name)){

        return `{${name.join(',')}}` ;
    }

    if(defaultValue){

        return `${name}=${defaultValue}` ;
    
    }else if(rest === true){

        return `...${name}` ;
    }

    return name ;
}

const keyRe = /^([^\.]+)\.([^\.]+)$/ ;

function process(params){

    let paramSet = {} ;

    for(let param of params){

        let {
            name,
            defaultValue,
            rest
        } = param ;

        let match = name.match(keyRe) ;

        if(match){

            let name = match[1].trim(),
                key = match[2].trim() ;

            if(paramSet.hasOwnProperty(name)){

                if(defaultValue){
                    
                    key = `${key}=${defaultValue}` ;
                
                }else if(rest === true){
            
                    key = `...${key}` ;
                }

                paramSet[name].push(key) ;
            }

        }else{

            paramSet[name] = [] ;
        }
    }

    let result = [] ;

    const {
        assign
    } = Object ;

    for(let param of params){

        let {
            name
        } = param ;

        if(paramSet.hasOwnProperty(name)){

            let data = paramSet[name] ;

            if(data.length){

                result.push({
                    name:data
                }) ;

            }else{

                result.push(assign({} , param)) ;
            }
        }
    }

    return result ;
}