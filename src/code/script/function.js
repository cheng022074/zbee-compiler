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
            imports,
        } = meta ;

        return {
            scoped,
            params:process_params(params),
            imports:process_imports(imports),
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

function process_imports(imports){

    let result = [] ;

    for(let config of imports){

        let {
            name,
            include
        } = config ;

        result.push(`const ${name} = include('${include}');`) ;
    }

    return result.join('\n') ;
}