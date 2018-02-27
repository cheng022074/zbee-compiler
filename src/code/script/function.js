const
Meta = require('../meta/script'),
Target = require('../target');

module.exports = code =>{

    return new ScriptFunctionTarget(code , Meta , 'code.bin.script.function' , 'code.package.script.function') ;
}

class ScriptFunctionTarget extends Target{

    applyBinCodeData(){

        let {
            code,
            meta
        } = super.applyBinCodeData() ;

        let {
            scoped,
            code:body,
            params,
        } = meta ;

        return {
            scoped,
            params:process_params(params),
            body
        }
    }
}

function process_params(params){

    let result = [] ;

    for(let param of params){

        let {
            name
        } = param ;

        result.push(name) ;
    }

    return result.join(',') ;
}