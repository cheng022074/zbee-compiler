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
            code:body
        } = meta ;

        return {
            scoped,
            body
        }
    }
}