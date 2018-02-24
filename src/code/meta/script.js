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
textCodeMetaParamArrayRe = /\[\]$/,
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
} = require('../../is') ;

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
            'extend',
            'isApplyExtendKeyword',
            'requires',
            'imports',
            'params',
            'ast',
        ]) ;
    }

    applyAst(){

        //  将源代码解析出Ast JSON树
    }

    applyIsApplyExtendKeyword(){

        // 解析代码
    }

    applyExtend(){

        let match = meta.match(textCodeMetaExtendRe) ;
        
        if(match){

            return match[1].trim() ;
        }

        return false ;
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

    applyParams(){

        let textCodeMetaParamRe = /@param\s+\{([^\{\}]+)\}\s+([^\n\r]+)/g,
            match,
            params = [],
            paramSet = {};

        while(match = textCodeMetaParamRe.exec(meta)){

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

                            param.type = 'object' ;

                            if(!param.hasOwnProperty('items')){

                                param.items = [] ;
                            
                            }

                            param.items.push({
                                type,
                                name:propertyName
                            }) ;
                        }

                    }else{

                        params.push({
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

                            if(!textCodeMetaParamArrayRe.test(type)){

                                type = `${type}[]` ;
                            }

                            params.push({
                                type,
                                rest:true,
                                name:match[1]
                            }) ;

                            continue ;
                        }
                    }

                    let placeholder = genreatePlaceholderString(content , /\"(?:\\.|[^\"])*\"|\'(?:\\.|[^\'])*\'/ , ()=> Date.now()) ;

                    let group = groupMatch(placeholder.data , {
                        regexp:/\[|\]/g,
                        region:{
                            start:'[',
                            end:']'
                        },
                        border:false
                    }) ;

                    if(group && group.length){

                        group = restorePlaceholderString(group[group.length - 1].trim() , placeholder.values) ;

                        let name = group.match(textCodeMetaParamNameRe)[0];

                        if(name === group){

                            params.push({
                                type,
                                name,
                                optiontal:true
                            }) ;

                        }else{

                            params.push({
                                type,
                                name,
                                defaultValue:group.replace(textCodeMetaParamNameDefaultValueRe , '').trim(),
                                optiontal:true
                            }) ;
                        }
                    }
                }
            }
        }

        return params ;
    }

    toString(){

        return this.data ;
    }
}