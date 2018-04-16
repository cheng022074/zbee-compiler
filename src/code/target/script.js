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
            configItems
        } = meta,
        {
            project
        } = code;

        return {
            defaultFolder:project.defaultFolder,
            libraries:project.libraries.libraryPaths,
            imports:process_imports(imports),
            configItems:process_config_items(configItems),
            body
        }
    }
}

function process_config_items(items){

    if(items){

        let result = [] ;

        for(let {
            name,
            target,
            key
        } of items){

            if(key){

                result.push(`const ${name} = config('${target}' , '${key}');`) ;
            
            }else{

                result.push(`const ${name} = config('${target}');`) ;
            }
        }

        return result.join('\n') ;
    }

    return '' ;
}

function process_imports(imports){

    let result = [] ;

    for(let {
        name,
        include
    } of imports){

        result.push(`const ${name} = include('${include}');`) ;
    }

    return result.join('\n') ;
}