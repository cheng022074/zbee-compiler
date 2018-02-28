const Target = require('../target') ;

module.exports = class extends Target{

    applyBinCodeData(){

        let {
            code,
            meta
        } = super.applyBinCodeData() ;

        let {
            code:body,
            imports,
        } = meta ;

        return {
            defaultFolder:code.project.defaultFolder,
            imports:process_imports(imports),
            body
        }
    }
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