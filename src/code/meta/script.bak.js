const 
textCodeMetaRe = /^\/\*(?:.|[^.])+?\*\//,
textCodeMetaAsyncRe = /@async/,
textCodeMetaOnceRe = /@once/,
textCodeMetaScopedRe = /@scoped/,
textCodeMetaRunAtRe = /@runat\s+([^\n\r]+)/,
textCodeMetaRunAtSplitRe = /\s+/,
textCodeMetaParamTypeSplitRe = /\|/,
textCodeMetaParamNameRe = /^(?:\.{3})?(\w+)(?:\.(\w+))?(?:\s*\=\s*(.+))?/,
textCodeMetaParamRestRe = /^\.{3}(\w+)/,
textCodeMetaParamTypeArrayRe = /\[\]$/,
textCodeMetaAliasImportRe = /(\.?\w+)\s+from\s+((?:\w+\:{2})?\w+(?:\.\w+)*)/,
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
    normalize
} = require('../../name'),
{
    match:string_match
} = require('../../regexp'),
{
    APPLICATION
} = require('../../project');

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

        defineCacheProperties(me , [
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
            'configItems',
            'once',
            'aliases'
        ]) ;
    }

    applyOnce(){

        return textCodeMetaOnceRe.test(this.data) ;
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

    applyAliases(){

        let textCodeMetaAliasRe = /@alias\s+(\w+)/g,
        match,
        aliases = [],
        me = this,
        {
            data,
            code
        } = me;

        while(match = textCodeMetaAliasRe.exec(data)){

            aliases.push(match[1].trim()) ;
        }

        return aliases ;
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
                data
            } = me;

        while(match = textCodeMetaImportRe.exec(data)){

            let content = match[1].trim() ;

            {
                let match = content.match(textCodeMetaAliasImportRe) ;

                if(match){

                    imports.push({
                        name:match[1],
                        include:match[2]
                    }) ;

                    continue ;
                }
            }

            imports.push({
                name:toCamelCase(content),
                include:content
            }) ;
        }

        imports.push(...me.configItemsAndImports.imports) ;

        return imports ;
    }

    applyImportNames(){

        let {
            imports
        } = this,
        names = [],
        {
            defaultFolder
        } = APPLICATION;

        for(let config of imports){

            names.push(normalize(config.include , defaultFolder)) ;
        }

        return names ;
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

                let match = string_match(content , /\[|\]/g , {
                    start:'[',
                    inner:true,
                    end:']'
                }) ;

                if(match){

                    content = match[0] ;
                }

                match = content.match(textCodeMetaParamNameRe) ;

                if(match){

                    let [
                        ,
                        targetName,
                        propertyName,
                        defaultValue
                    ] = match;

        
                    if(targetName && propertyName){

                        if(paramSet.hasOwnProperty(targetName)){

                            let param = paramSet[targetName] ;

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
                                defaultValue,
                                name:propertyName
                            }) ;
                        }

                    }

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
                        add_params(params , paramSet , targetName , {
                            type,
                            name:targetName,
                            defaultValue
                        }) ;
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