const 
Target = require('../target'),
{
    unique
} = require('../../array'),
{
    defineCacheProperty
} = require('../../object'),
{
    parse
} = require('../../name');

module.exports = class extends Target{

    constructor(...args){

        super(...args) ;

        defineCacheProperty(this , 'aliases') ;
    }

    applyAliases(){

        let {
            meta,
            sourceCode
        } = this,
        {
            aliases
        } = meta,
        result = [],
        defaultFolder = sourceCode.project.defaultFolder;

        if(aliases){

            for(let alias of aliases){

                result.push(parse(alias , defaultFolder)) ;
            }
        }

        return result ;
    }

    applyBinCodeData(){

        let {
            code,
            meta
        } = super.applyBinCodeData() ;

        let {
            code:body,
            imports,
            configItems
        } = meta ;

        return {
            imports:process_imports(imports),
            importNames:process_import_names(imports),
            configItems:process_config_items(configItems),
            configItemNames:process_config_item_names(configItems),
            body
        }
    }
}

const pathSplitRe = /\\/g ;

function process_libraries(paths){

    let result = [] ;

    for(let path of paths){

        result.push(`require('${path.replace(pathSplitRe , '\\\\')}')`) ;
    }


    return `[${result.join(',')}]` ;
}

function process_import_names(imports){

    if(imports.length){

        let result = [] ;

        for(let {
            name
        } of imports){
    
            result.push(name) ;
        }
    
        return `let ${unique(result).join(',')};` ;
    }

    return '' ;
}

function process_config_item_names(items){

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

function process_config_items(items){

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

function process_imports(imports){

    let result = [] ;

    for(let {
        name,
        include
    } of imports){

        result.push(`${name} = include('${include}');`) ;
    }

    return result.join('\n') ;
}