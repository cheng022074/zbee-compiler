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
textCodeMetaConfigItemRe = /(\w+)\s+from\s+(\w+(?:\.\w+)*)(?:\.{3}(\w+(?:\.\w+)*))?/,
{
    toCamelCase
} = require('../../name');

module.exports = class extends Meta{

    constructor(code){

        super(code) ;

        let me = this ;

        me.data = readTextFile(code.path) ;

        defineProperty(me , 'header') ;
    }

    getHeader(){

        let {
            data
        } = this,
        result = data.match(textCodeMetaRe);

        if(result){

            return result[0] ;
        }

        return '' ;
    }

    getBody(){

        let {
            data
        } = this ;
        
        return data.replace(textCodeMetaRe , '') ;
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
}