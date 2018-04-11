const 
textCodeMetaRe = /^\/\*(?:.|[^.])+?\*\//,
textCodeMetaAsyncRe = /@async/,
textCodeMetaScopedRe = /@scoped/,
textCodeMetaRunAtRe = /@runat\s+([^\n\r]+)/,
textCodeMetaRunAtSplitRe = /\s+/,
textCodeMetaExtendRe = /@extend\s+([^\n\r]+)/,
textCodeMetaParamTypeSplitRe = /\|/,
textCodeMetaParamNameRe = /^(\w+)(?:\.(\w+))?/,
textCodeMetaParamRestRe = /^\.{3}(\w+)/,
textCodeMetaParamTypeArrayRe = /\[\]$/,
textCodeMetaParamOptionalDefaultValueRe = /^(\w+)\s*\=(.+?)$/,
textCodeMetaAliasImportRe = /(\.?\w+)\s+from\s+((?:\w+\:{2})?\w+(?:\.\w+)*)/,
textCodeMetaAliasFirstDotImportRe = /^\./,
textCodeMetaConfigItemRe = /(\w+)\s+from\s+(\w+(?:\.\w+)*)(?:\.{3}(\w+(?:\.\w+)*))?/,
{
    defineCacheProperties
} = require('../../object'),
{
    split
} = require('../../string'),
{
    readTextFile
} = require('../../fs'),
{
    array:is_array
} = require('../../is'),
{
    toCamelCase,
    parse
} = require('../../name'),
{
    unique
} = require('../../array'),
{
    match:string_match
} = require('../../regexp');

module.exports = class {

    constructor(code){

        let data = readTextFile(code.path).trim(),
            me = this,
            match = data.match(textCodeMetaRe) ;

        if(match){

            me.data = match[0] ;
        
        }else{

            me.data = '' ;
        }

        me.code = data.replace(textCodeMetaRe , '') ;

        me.fullName = code.fullName ;

        defineCacheProperties(this , [
            'async',
            'scoped',
            'runAt',
            'requires',
            'params',
            'paramSet',
            'paramInformations',
            'imports',
            'importNames',
            'configItemsAndImports',
            'configItems'
        ]) ;

        me.target = code ;
    }

    applyAsync(){

        return textCodeMetaAsyncRe.test(this.data) ;
    }

    applyScoped(){

        return textCodeMetaScopedRe.test(this.data) ;
    }

    applyRunAt(){

        let match = this.data.match(textCodeMetaRunAtRe) ;

        if(match){

            return split(match[1].trim() , textCodeMetaRunAtSplitRe) ;
        }

        return [
            'node',
            'browser'
        ] ;
    }

    applyConfigItems(){

        return this.configItemsAndImports.items ;
    }
    
    applyConfigItemsAndImports(){

        let textCodeMetaConfigRe = /@config\s+([^\n\r]+)/g,
            match,
            imports = [],
            items = [],
            {
                data
            } = this;

        while(match = textCodeMetaConfigRe.exec(data)){

            let content = match[1].trim() ;

            {
                let match = content.match(textCodeMetaConfigItemRe) ;

                if(match){

                    let name = match[1],
                        target = match[2],
                        key = match[3] ;

                    if(key){

                        items.push({
                            name,
                            target,
                            key
                        }) ;

                    }else{

                        items.push({
                            name,
                            target
                        }) ;
                    }

                    let implement = `config::${target}` ;

                    imports.push({
                        name:toCamelCase(implement),
                        include:implement
                    }) ;
                }
            }
        }

        return {
            imports,
            items
        } ;
    }

    applyImports(){

        let textCodeMetaImportRe = /@import\s+([^\n\r]+)/g,
            match,
            imports = [],
            me = this,
            {
                fullName,
                data
            } = me;

        while(match = textCodeMetaImportRe.exec(data)){

            let content = match[1].trim() ;

            {
                let match = content.match(textCodeMetaAliasImportRe) ;

                if(match){

                    let name = match[1],
                        implement = match[2];

                    if(textCodeMetaAliasFirstDotImportRe.test(name)){

                        imports.push({
                            name:name.replace(textCodeMetaAliasFirstDotImportRe , ''),
                            item:true,
                            include:process_import(fullName , implement)
                        }) ;
                    
                    }else{

                        imports.push({
                            name,
                            include:process_import(fullName , implement)
                        }) ;
                    }

                    continue ;
                }
            }

            imports.push({
                name:toCamelCase(content),
                include:process_import(fullName , content)
            }) ;
        }

        imports.push(...me.configItemsAndImports.imports) ;

        return imports ;
    }

    applyImportNames(){

        let {
            imports
        } = this,
        names = [
            'object.get'
        ];

        for(let config of imports){

            names.push(config.include) ;
        }

        return unique(names) ;
    }

    applyParams(){

        return this.paramInformations.params ;
    }

    applyParamSet(){

        return this.paramInformations.paramSet ;

    }

    applyParamInformations(){

        let textCodeMetaParamRe = /@param\s+\{([^\{\}]+)\}\s+([^\n\r]+)/g,
            match,
            params = [],
            paramSet = {};

        while(match = textCodeMetaParamRe.exec(this.data)){

            let type = match[1].trim().toLowerCase(),
                content = match[2].trim(),
                types = split(type , textCodeMetaParamTypeSplitRe) ;

            if(types.length > 1){

                type = types ;
            }

            {
                let match = content.match(textCodeMetaParamNameRe) ;
                
                if(match){

                    let [
                        ,
                        targetName,
                        propertyName
                    ] = match;

                    if(targetName && propertyName){

                        if(paramSet.hasOwnProperty(targetName)){

                            let param = paramsSet[targetName] ;

                            switch(param.type){

                                case 'object':
                                case 'array':

                                    break ;

                                default:

                                    param.type = 'object' ;
                            }

                            if(!param.hasOwnProperty('items')){

                                param.items = [] ;
                            
                            }

                            add_params(param.items , paramSet , `${targetName}.${propertyName}` , {
                                type,
                                name:propertyName
                            }) ;
                        }

                    }else{

                        add_params(params , paramSet , targetName , {
                            type,
                            name:targetName
                        }) ;
                    }

                }else{

                    {
                        let match = content.match(textCodeMetaParamRestRe) ;

                        if(match){

                            if(is_array(type)){

                                type = type[0] ;
                            }

                            if(!textCodeMetaParamTypeArrayRe.test(type)){

                                type = `${type}[]` ;
                            }

                            let name = match[1] ;

                            add_params(params , paramSet , name , {
                                type,
                                rest:true,
                                name
                            }) ;

                            break ;
                        }
                    }

                    {
                        let match = string_match(content , /\[|\]/g , {
                            start:'[',
                            inner:true,
                            end:']'
                        }) ;

                        if(match){

                            let data = match[0];

                            {
                                let match = data.match(textCodeMetaParamOptionalDefaultValueRe) ;

                                if(match){

                                    let name = match[1] ;

                                    add_params(params , paramSet , name , {
                                        type,
                                        name,
                                        defaultValue:match[2].trim(),
                                        optiontal:true
                                    }) ;
                                
                                }else{

                                    let name = data ;

                                    add_params(params , paramSet , name , {
                                        type,
                                        name,
                                        optiontal:true
                                    }) ;
                                }
                            }

                        }
                    }
                }
            }
        }

        return {
            params,
            paramSet
        } ;
    }

    toString(){

        return this.data ;
    }
}

function add_params(params , paramSet ,  name , config){

    if(!paramSet.hasOwnProperty(name)){

        params.push(paramSet[name] = config) ;
    }
}

const prefixDotRe = /^\./ ;

function process_import(rootName , name){

    if(prefixDotRe.test(name)){

        return `${rootName}${name}` ;
    }

    return name ;
}