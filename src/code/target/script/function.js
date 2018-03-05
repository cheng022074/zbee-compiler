const Target = require('../script') ;

module.exports = class extends Target{

    applyBinCodeData(){

        let {
            scoped,
            params
        } = this.meta ;

        return Object.assign({
            scoped,
            params:process_params(params)
        } , super.applyBinCodeData()) ;
    }
}

function process_params(params){

    let result = [] ;

    for(let param of params){

        let {
            name,
            defaultValue
        } = param ;

        if(defaultValue){

            result.push(`${name} = ${defaultValue}`) ;
        
        }else{

            result.push(name) ;
        }
    }

    return result.join(',') ;
}