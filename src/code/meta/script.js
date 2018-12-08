const 
Meta = require('../meta')(),
textCodeMetaRe = /\/\*(?:.|[^.])+?\*\//,
{
    readTextFile
} = require('../../fs'),
{
    defineProperty
} = require('../../object'),
textCodeMetaAliasImportRe = /(\w+)\s+from\s+((?:\w+\:{2})?\w+(?:\.\w+)*)/,
textCodeMetaImportScopedRe = /\s+scoped$/,
textCodeMetaConfigItemRe = /(\w+)\s+from\s+(\w+(?:\.\w+)*)(?:\.{3}(\w+(?:\.\w+)*))?/,
{
    toCamelCase
} = require('../../name') ;

module.exports = class extends Meta{

    constructor(code){

        super(code) ;

        let me = this ;

        defineProperty(me , 'header') ;
    }

    getRawBody(){

        return readTextFile(this.code.path) ;
    }

    getHeader(){

        let {
            rawBody
        } = this,
        result = rawBody.match(textCodeMetaRe);

        if(result){

            return result[0] ;
        }

        return '' ;
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

        let textCodeMetaImportRe = /@import\s+([^\n\r]+)?/g,
            match,
            imports = [],
            me = this,
            {
                header
            } = me;

        while(match = textCodeMetaImportRe.exec(header)){

            let content = match[1].trim(),
                importConfig = {};

            importConfig.scoped = textCodeMetaImportScopedRe.test(content) ;

            content = content.replace(textCodeMetaImportScopedRe , '') ;

            let result = content.match(textCodeMetaAliasImportRe);

            if(result){

                let [
                    ,
                    name,
                    target
                ] = result ;

                importConfig.name = name,
                importConfig.target = target ;

            }else{

                importConfig.name = toCamelCase(content),
                importConfig.target = content ;
            }

            imports.push(importConfig) ;
        }

        return imports ;
    }
}

