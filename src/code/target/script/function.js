const Target = require('../script') ;

module.exports = class extends Target{

    applyBinCodeData(){

        let {
            scoped,
            params
        } = this.meta ;

        return Object.assign({
            scoped,
            params:process_params(params),
            paramNames:process_param_names(params),
        } , super.applyBinCodeData()) ;
    }
}

function process_params(params){

    let result = [] ;

    for(let {
        name,
        defaultValue
    } of params){

        if(defaultValue){

            result.push(`${name} = ${defaultValue}`) ;
        
        }else{

            result.push(name) ;
        }
    }

    return result.join(',') ;
}

function process_param_names(params){

    let names = [] ;

    for(let {
        name
    } of params){

        names.push(name) ;
    }

    return names ;
}