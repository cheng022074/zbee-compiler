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

    console.log(params) ;

    for(let param of params){

        let {
            name
        } = param ;

        result.push(name) ;
    }

    return result.join(',') ;
}