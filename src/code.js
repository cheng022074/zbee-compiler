const {
    file:is_file,
    string:is_string,
    simpleObject:is_simple_object
} = require('./is'),
{
    readTextFile,
    getFileUpdateTime
} = require('./fs'),
{
    defineKey,
    deleteKeys
} = require('./object'),
{
    require:module_require
} = require('./module'),
{
    split,
    capitalizeName
} = require('./string'),
namespaceRe = /\.\*$/,
baseSuffixRe = /\.[^\.]+$/,
{
    genreatePlaceholderString,
    restorePlaceholderString
} = require('./RegExp');

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

        if(path){

            me.updateTime = getFileUpdateTime(path) ;
        }
    }

    get fullName(){

        return defineKey(this , '$fullName' , 'generateFullName') ;
    }

    generateFullName(){

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

    get isUpdated(){

        let me = this,
            path = me.path;

        if(path){

            return getFileUpdateTime(path) !== me.updateTime ;
        }

        return false ;
    }

    sync(){

        let me = this ;

        if(me.isUpdated === true){

            me.doSync() ;
        }
    }

    doSync(){

        let me = this ;

        me.updateTime = getFileUpdateTime(me) ;
    }
}

class BinCode extends Code{

    get caller(){

        return defineKey(this , '$caller' , 'generateCaller') ;
    }

    generateCaller(){

        let me = this ;

        if(me.isFile){

            let path = me.path ;
            
            if(me.scope === 'template'){
                
                return readTextFile(path) ;
            }
    
            switch(me.suffix.match(baseSuffixRe)[0]){
                
                case '.json':
                case '.js':
    
                    return module_require(path) ;
    
                case '.xml':
    
                    return readXMLFile(path) ;
    
                case '.html':
    
                    return readHTMLFile(path) ;
            }

            return readTextFile(path) ;
        }
    }

    doSync(){

        super.doSync() ;

        delete this.$caller ;
    }
}

exports.BinCode = BinCode ;

const textCodeMetaRe = /^\/\*(?:.|[^.])+?\*\//,
      textCodeMetaParamNameRe = /^\w+/,
      textCodeMetaParamRestRe = /^\.{3}(\w+)/,
      textCodeMetaParamNameDefaultValueRe = /^\w+\s*\=/,
      textCodeMetaParamTypeSplitRe = /\|/,
      {
          groupMatch
      } = require('./RegExp'),
      textCodeMetaParamArrayRe = /\[\]$/;

function get_text_code_params(meta){
    
    let textCodeMetaParamRe = /@param\s+\{([^\{\}]+)\}\s+([^\n\r]+)/g,
        match,
        params = [];

    while(match = textCodeMetaParamRe.exec(meta)){

        let type = match[1].trim().toUpperCase(),
            content = match[2].trim();

        if(type){

            let types = split(type , textCodeMetaParamTypeSplitRe) ;

            if(types.length > 1){

                type = types ;
            }
        }

        {
            let match = content.match(textCodeMetaParamNameRe) ;
            
            if(match){
    
                params.push({
                    type,
                    name:match[0]
                }) ;
    
            }else{

                {
                    let match = content.match(textCodeMetaParamRestRe) ;

                    if(match){

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

                    group = restorePlaceholderString(group[0].trim() , placeholder.values) ;

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

    let textCodeMetaImportRe = /@import\s+([^\n\r]+)/g,
        textCodeMetaAliasImportRe = /(\w+)\s+from\s+(\w+(?:\.\w+)*)/,
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
            var:capitalizeName(content),
            require:content
        }) ;
    }

    return imports ;
}

const textCodeMetaScopedRe = /@scoped/ ;

function get_text_code_scoped(meta){

    return textCodeMetaScopedRe.test(meta) ;
}

const textCodeMetaRunAtdRe = /@runat\s+([^\n\r]+)/ ;

function get_text_code_runat(meta){

    let match = meta.match(textCodeMetaRunAtdRe) ;

    if(match){

        return match[1].trim() ;
    }

    return 'any' ;
}

class SourceCode extends Code{

    get code(){

        return defineKey(this , '$code' , 'generateCode') ;
    }

    generateCode(){

        let me = this ;
        
        if(me.isFile){

            let path = me.path ;

            if(me.scope === 'template'){
                
                return readTextFile(path) ;
            }
    
            switch(me.suffix.match(baseSuffixRe)[0]){
                
                case '.json':
    
                    return module_require(path) ;
    
                case '.xml':
    
                    return readXMLFile(path) ;
    
                case '.html':
    
                    return readHTMLFile(path) ;
            }

            return readTextFile(path) ;
        }
    }

    get meta(){

        return defineKey(this , '$meta' , 'generateMeta') ;
    }

    generateMeta(){

        let code = this.code ;
        
        if(is_string(code)){

            let match = code.trim().match(textCodeMetaRe) ;

            if(match){

                let meta = match[0] ;

                return {
                    runat:get_text_code_runat(meta),
                    scoped:get_text_code_scoped(meta),
                    imports:get_text_code_imports(meta),
                    params:get_text_code_params(meta),
                    code
                } ;
            }
        }

        return {
            runat:'any',
            scoped:false,
            imports:[],
            params:[],
            code
        } ;
    }

    get importAllSourceCodes(){

        return defineKey(this , '$importAllSourceCodes' , 'generateImportAllSourceCodes') ;
    }

    generateImportAllSourceCodes(){

        let code = this,
            codes = [
                code
            ];

        get_import_source_codes(code , codes) ;

        codes.pop() ;

        return codes ;
    }

    get importSourceCodes(){

        return defineKey(this , '$importSourceCodes' , 'generateImportSourceCodes') ;
    }

    generateImportSourceCodes(){

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

    doSync(){

        super.doSync() ;

        deleteKeys(this , [
            '$importSourceCodes',
            '$importAllSourceCodes',
            '$meta',
            '$code'
        ]) ;
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