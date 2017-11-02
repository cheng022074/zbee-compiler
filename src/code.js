const {
    file:is_file,
    string:is_string,
    simpleObject:is_simple_object
} = require('./is'),
{
    readTextFile
} = require('./fs');

class Code{

    constructor(config){

        let {
            path,
            name,
            scope,
            suffix
        } = config,
        me = this;

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

        if(me.hasOwnProperty('$isFile')){

            return me.$isFile ;
        }

        let path = this.path ;

        if(path){

            return  me.$isFile = is_file(me.path) ;
        }

        return  me.$isFile = false ;
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

const textCodeMetaRe = /^\/\*(?:.|[^.])+?\*\//;

function get_text_code_params(meta){
    
    let textCodeMetaParamRe = /@param\s+\{([^\{\}]+)\}\s+([^\s\n\r]+)\s+([^\n\r]+)/g,
        match,
        params = [];

    while(match = textCodeMetaParamRe.exec(code)){
        
        params.push({
            type:match[1].trim(),
            name:match[2].trim()
        }) ;
    }

    return params ;
}

function get_text_code_imports(meta){

    let textCodeMetaImportRe = /@import\s+([^\n\r]+)/g,
        textCodeMetaAliasImportRe = /(\w+)\s+from\s+(\w+(?:\.\w+)?)/ ;
        match,
        imports = [];

    while(match = textCodeMetaImportRe.exec(code)){

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


            }

            return {
                code
            } ;

        }else if(is_simple_object(code)){

            let {
                imports,
                params
            } = code;

            return {
                imports,
                params,
                code
            }
        }
    }
}

exports.SourceCode = SourceCode ;