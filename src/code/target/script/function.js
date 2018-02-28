const Target = require('../../target') ;

module.exports = class extends Target{

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
            defaultFolder:code.project.defaultFolder,
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