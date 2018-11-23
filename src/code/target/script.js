const 
Target = require('../target'),
{
    unique,
    remove
} = require('../../array'),
{
    defineCacheProperty
} = require('../../object'),
{
    parse
} = require('../../name');

module.exports = class extends Target{

    applyAliases(){

        let {
            meta
        } = this,
        {
            aliases
        } = meta;

        if(aliases){

            aliases = unique(aliases) ;

            remove(aliases , 'include') ;

            return aliases ;
        }

        return [] ;
    }

    applyBinCodeData(){

        let {
            code,
            meta
        } = super.applyBinCodeData() ;

        let {
            code:body,
            imports,
            importNames,
            configItems
        } = meta ;

        return {
            imports:process_imports(imports),
            importNames:process_import_names(importNames),
            configItems:process_config_items(configItems),
            configItemNames:process_config_item_names(configItems),
            body
        }
    }
}

function process_import_names(names = []){

    if(names.length){

        let result = [] ;

        for(let name of names){
    
            result.push(name) ;
        }
    
        return `let ${unique(result).join(',')};` ;
    }

    return '' ;
}

function process_config_item_names(items = []){

    if(items && items.length){

        let result = [] ;

        for(let {
            name
        } of items){

            result.push(name) ;
        }

        return `let ${result.join(',')};` ;
    }

    return '' ;
}

function process_config_items(items = []){

    if(items){

        let result = [] ;

        for(let {
            name,
            target,
            key
        } of items){

            if(key){

                result.push(`${name} = config('${target}' , '${key}');`) ;
            
            }else{

                result.push(`${name} = config('${target}');`) ;
            }
        }

        return result.join('\n') ;
    }

    return '' ;
}

function process_imports(imports = []){

    let result = [] ;

    for(let {
        name,
        include
    } of imports){

        result.push(`${name} = include('${include}');`) ;
    }

    return result.join('\n') ;
}