const 
Meta = require('../meta')(),
textCodeMetaRe = /\/\*(?:.|[^.])+?\*\//,
{
    readTextFile
} = require('../../fs'),
textCodeMetaAliasImportRe = /(\w+)\s+from\s+((?:(?:\w+\:{2})?\w+(?:\.\w+)*)|(\.*(?:\.\w+)+))/,
textCodeMetaImportScopedRe = /\s+scoped$/,
textCodeMetaImportValueRe = /\s+value$/,
textCodeMetaConfigItemRe = /(\w+)\s+from\s+(\w+(?:\.\w+)*)(?:\.{3}(\w+(?:\.\w+)*))?/,
nonStandardRe = /@non\-standard/,
{
    toCamelCase
} = require('../../name'),
dotPrefixRe = /^\./,
dobuleDotPrefixRe = /^(?:\.{2})+/,
dotRe = /\./;

module.exports = class extends Meta{

    getIsStandard(){

        let {
            header
        } = this ;

        return !nonStandardRe.test(header) ;
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

        let textCodeRequireRe = /@require\s+([\w\-\.]+)/g,
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
            me = this,
            {
                header
            } = me;

        while(match = textCodeMetaImportRe.exec(header)){

            let content = match[1].trim(),
                importConfig = {},
                scoped = importConfig.scoped = textCodeMetaImportScopedRe.test(content);

            if(scoped){

                content = content.replace(textCodeMetaImportScopedRe , '') ;

                importConfig.value = false ;

            }else{

                importConfig.value = textCodeMetaImportValueRe.test(content) ;

                content = content.replace(textCodeMetaImportValueRe , '') ;
            }

            let result = content.match(textCodeMetaAliasImportRe);

            if(result){

                let [
                    ,
                    name,
                    target
                ] = result ;

                importConfig.name = name,
                importConfig.target = me.getFullName(target) ;

            }else{

                let target = me.getFullName(content) ;

                importConfig.name = toCamelCase(target),
                importConfig.target = target ;
            }

            imports.push(importConfig) ;
        }

        return imports ;
    }

    getFullName(name){
    
        let {
            fullName
        } = this.code,
        names = fullName.split(dotRe) ;
    
        if(dobuleDotPrefixRe.test(name)){
    
            let [
                result
            ] = name.match(dobuleDotPrefixRe),
            count = result.length / 2;
    
            for(let i = 0 ; i < count ; i ++){
    
                names.pop() ;
            }

            if(names.length === 0){

                return name.replace(dobuleDotPrefixRe , '') ;
            }
    
            return `${names.join('.')}${name.replace(dobuleDotPrefixRe , '.')}` ;
        
        }else if(dotPrefixRe.test(name)){
    
            names.pop() ;

            if(names.length === 0){

                return name.replace(dotPrefixRe , '') ;
            }
    
            return `${names.join('.')}${name}` ;
        
        }
    
        return name ;
    }
}

