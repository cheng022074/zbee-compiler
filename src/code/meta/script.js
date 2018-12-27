const 
Meta = require('../meta')(),
textCodeMetaRe = /\/\*(?:.|[^.])+?\*\//,
{
    readTextFile
} = require('../../fs'),
textCodeMetaAliasImportRe = /(\w+)\s+from\s+((?:(?:\w+\:{2})?\w+(?:\.\w+)*)|((?:\.\w+)+))/,
textCodeMetaImportScopedRe = /\s+scoped$/,
textCodeMetaConfigItemRe = /(\w+)\s+from\s+(\w+(?:\.\w+)*)(?:\.{3}(\w+(?:\.\w+)*))?/,
{
    toCamelCase
} = require('../../name') ;

module.exports = class extends Meta{

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

        return super.getHeader() ;
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

    getRequires(){

        let textCodeRequireRe = /@require\s+([\w\-]+)/g,
            match,
            requires = [],
            {
                header
            } = this;

        while(match = textCodeRequireRe.exec(header)){

            requires.push(match[1].trim()) ;
        }

        return requires ;
    }

    getImports(){

        let textCodeMetaImportRe = /@import\s+([^\n\r]+)/g,
            match,
            imports = [],
            {
                header,
                code
            } = this;

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
                importConfig.target = get_target(target , code) ;

            }else{

                importConfig.name = toCamelCase(content),
                importConfig.target = get_target(content , code) ;
            }

            imports.push(importConfig) ;
        }

        return imports ;
    }
}

const
dotPrefixRe = /^\./,
baseNameRe = /\.?[^\.\:]+$/;

function get_target(name , {
    fullName
}){

    if(dotPrefixRe.test(name)){

        return `${fullName.replace(baseNameRe , '')}${name}` ;
    }

    return name ;
}

