const 
ScriptMeta = require('../script'),
Param = require('./function/param'),
returnTypeRe = /@return\s+\{([^\{\}]+)\}/,
getDataTypes = require('../datatypes'),
textCodeMetaAliasImportRe = /(\w+)\s+from\s+((?:\w+\:{2})?\w+(?:\.\w+)*)/,
textCodeMetaConfigItemRe = /(\w+)\s+from\s+(\w+(?:\.\w+)*)(?:\.{3}(\w+(?:\.\w+)*))?/,
{
    toCamelCase
} = require('../../../name');

class FunctionMeta extends ScriptMeta{

    getReturnTypes(){

        let {
            header
        } = this ;

        let result = header.match(returnTypeRe) ;

        if(result){

            return getDataTypes(result[1]) ;
        }

        return super.applyReturnTypes() ;
    }

    getConfigs(){

        let textCodeMetaConfigRe = /@config\s+([^\n\r]+)/g,
            match,
            items = [],
            {
                header
            } = this;

        while(match = textCodeMetaConfigRe.exec(header)){

            let content = match[1].trim(),
                result = content.match(textCodeMetaConfigItemRe) ;

            if(result){

                let [
                    ,
                    name,
                    target,
                    key
                ] = result ;

                items.push({
                    name,
                    target,
                    key
                }) ;
            }
        }

        return items ;
    }

    getImports(){

        let textCodeMetaImportRe = /@import\s+([^\n\r]+)/g,
            match,
            imports = [],
            me = this,
            {
                header
            } = me;

        while(match = textCodeMetaImportRe.exec(header)){

            let content = match[1].trim(),
                result = content.match(textCodeMetaAliasImportRe) ;

            if(result){

                let [
                    ,
                    name,
                    target
                ] = result ;

                imports.push({
                    name,
                    target
                }) ;

            }else{

                imports.push({
                    name:toCamelCase(content),
                    target:content
                }) ;
            }
        }

        return imports ;
    }

    getParams(){

        let 
        {
            header
        } = this,
        textCodeMetaParamRe = /@param\s+\{([^\{\}]+)\}\s+([^\n\r]+)/g,
        result = [],
        match,
        params = {};

        while(match = textCodeMetaParamRe.exec(header)){

            let [
                ,
                type,
                rawData
            ] = match,
            param = new Param(rawData , type),
            {
                name,
                parentParamName
            } = param;

            if(parentParamName && params.hasOwnProperty(parentParamName)){

                params[parentParamName].add(param) ;
            
            }else{

                params[name] = param ;

                result.push(param) ;
            }
        }

        return result ;
    }
}

module.exports = code =>{

    return new FunctionMeta(code) ;
}