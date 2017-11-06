const {
    file:is_file,
    string:is_string,
    simpleObject:is_simple_object
} = require('./is'),
{
    readTextFile
} = require('./fs');

class Code{

    constructor(project , config){

        let {
            path,
            name,
            scope,
            suffix
        } = config,
        me = this;

        me.project = project ;

        me.path = path ;

        me.name = name ;

        me.scope = scope ;

        me.suffix = suffix ;
    }

    get fullName(){

        let {
            scope,
            name
        } = this ;

        return `${scope}::${name}` ;
    }

    get isFile(){

        let me = this ;

        let path = this.path ;

        if(path){

            return is_file(me.path) ;
        }

        return false ;
    }
}

class BinCode extends Code{

    get caller(){

        let me = this ;

        if(me.isFile){

            return require(me.path) ;
        }
    }
}

exports.BinCode = BinCode ;

const textCodeMetaRe = /^\/\*(?:.|[^.])+?\*\//,
      textCodeMetaParamNameRe = /^\w+/,
      textCodeMetaParamNameDefaultValueRe = /^\w+\s*\=/,
      {
          groupMatch
      } = require('./RegExp');

function get_text_code_params(meta){
    
    let textCodeMetaParamRe = /@param\s+\{([^\{\}]+)\}\s+([^\n\r]+)/g,
        match,
        params = [];

    while(match = textCodeMetaParamRe.exec(meta)){

        let type = match[1].trim(),
            content = match[2].trim();

        {
            let match = content.match(textCodeMetaParamNameRe) ;
            
            if(match){
    
                params.push({
                    type,
                    name:match[0]
                }) ;
    
            }else{
    
                let group = groupMatch(content , {
                    regexp:/\[|\]/g,
                    region:{
                        start:'[',
                        end:']'
                    },
                    border:false,
                    multi:false
                }) ;
    
                if(group){
    
                    group = group.trim() ;
    
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

function get_text_code_imports(meta){

    let textCodeMetaImportRe = /@import\s+(\w+(?:\.\w+)?)/g,
        textCodeMetaAliasImportRe = /(\w+)\s+from\s+(\w+(?:\.\w+)?)/,
        match,
        imports = [];

    while(match = textCodeMetaImportRe.exec(meta)){

        let content = match[1].trim() ;

        {
            let match = content.match(textCodeMetaAliasImportRe) ;

            if(match){

                imports.push({
                    var:match[1],
                    require:match[2]
                }) ;

                continue ;
            }
        }

        imports.push({
            var:content,
            require:content
        }) ;
    }

    return imports ;
}

const textCodeMetaScopedRe = /@scoped/ ;

class SourceCode extends Code{

    get code(){

        let me = this ;

        if(me.isFile){

            return readTextFile(me.path) ;
        }
    }

    get meta(){

        let code = this.code ;

        if(is_string(code)){

            let match = code.trim().match(textCodeMetaRe) ;

            if(match){

                let meta = match[0] ;

                return {
                    scoped:textCodeMetaScopedRe.test(meta),
                    imports:get_text_code_imports(meta),
                    params:get_text_code_params(meta),
                    code
                } ;
            }

            return {
                imports:[],
                params:[],
                code
            } ;
        }
    }

    get importAllSourceCodes(){

        let code = this,
            codes = [
                code
            ];

        get_import_source_codes(code , codes) ;

        codes.pop() ;

        return codes ;
    }

    get importSourceCodes(){

        let me = this,{
            imports
        } = me.meta,
        project = me.project,
        codes = [];

        for(let importConfig of imports){

            let {
                require
            } = importConfig ;

            let code = project.getSourceCode(require) ;

            if(code){

                codes.push(code) ;
            }
        }

        return codes ;
    }
}

function get_import_source_codes(code , codes){

    let importCodes = code.importSourceCodes ;

    for(let importCode of importCodes){

        if(!codes.includes(importCode)){

            codes.splice(codes.indexOf(code) , 0 , importCode) ;

            get_import_source_codes(importCode , codes) ;
        }
    }
}

exports.SourceCode = SourceCode ;