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
textCodeMetaParamOptionalRe = /^\[(.+)\]$/,
textCodeMetaParamOptionalDefaultValueRe = /^(\w+)\s*\=(.+?)$/,
textCodeMetaAliasImportRe = /(\.?\w+)\s+from\s+((?:\w+\:{2})?\w+(?:\.\w+)*)/,
textCodeMetaAliasFirstDotImportRe = /^\./,
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
    toCamelCase
} = require('../../string');

module.exports = class {

    constructor(code){

        let data = readTextFile(code.path),
            me = this,
            match = data.match(textCodeMetaRe) ;

        if(match){

            me.data = match[0] ;
        
        }else{

            me.data = '' ;
        }

        me.code = data.replace(textCodeMetaRe , '') ;

        defineCacheProperties(this , [
            'async',
            'scoped',
            'runAt',
            'isApplyExtendKeyword',
            'requires',
            'params',
            'paramSet',
            'paramInformations',
            'imports',
            'importNames'
        ]) ;
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

    applyImports(){

        let textCodeMetaImportRe = /@import\s+([^\n\r]+)/g,
            match,
            imports = [];

        while(match = textCodeMetaImportRe.exec(meta)){

            let content = match[1].trim() ;

            {
                let match = content.match(textCodeMetaAliasImportRe) ;

                if(match){

                    let name = match[1],
                        implement = match[2];

                    if(textCodeMetaAliasFirstDotImportRe.test(name)){

                        imports.push({
                            var:name.replace(textCodeMetaAliasFirstDotImportRe , ''),
                            item:true,
                            include:implement
                        }) ;
                    
                    }else{

                        imports.push({
                            var:name,
                            include:implement
                        }) ;
                    }

                    continue ;
                }
            }

            imports.push({
                var:toCamelCase(content),
                include:content
            }) ;
        }

        return imports ;
    }

    applyImportNames(){

        let {
            imports
        } = this,
        names = [];

        for(let config of imports){

            names.push(config.include) ;
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
                        let match = content.match(textCodeMetaParamOptionalRe) ;

                        if(match){

                            let data = match[1];

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