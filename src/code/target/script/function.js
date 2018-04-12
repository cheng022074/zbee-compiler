const Target = require('../script') ;

module.exports = class extends Target{

    applyBinCodeData(){

        let {
            scoped,
            params,
            async
        } = this.meta ;

        return Object.assign({
            scoped,
            params:process_params(params),
            paramNames:process_param_names(params),
            async
        } , super.applyBinCodeData()) ;
    }
}

function process_params(params){

    let result = [] ;

    for(let {
        name,
        defaultValue,
        rest
    } of params){

        if(defaultValue){

            result.push(`${name} = ${defaultValue}`) ;
        
        }else if(rest){

            result.push(`...${name}`) ;

        }else{

            result.push(name) ;
        }
    }

    return result.join(',') ;
}

function process_param_names(params){

    let names = [] ;

    for(let {
        name,
        rest
    } of params){

        if(rest){

            names.push(`...${name}`) ;
        
        }else{

            names.push(name) ;
        }
    }

    return names ;
}