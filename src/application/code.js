const {
    SourceCode,
    BinCode
} = require('../code'),
{
    readTextFile,
    readJSONFile,
    readHTMLFile,
    readXMLFile
} = require('../fs'),
{
    file:is_file,
    string:is_string
} = require('../is'),
{
    join
} = require('path'),
{
    require:module_require
} = require('../module'),
{
    encode
} = require('../object/key'),
{
    groupMatch,
    genreatePlaceholderString,
    restorePlaceholderString
} = require('../RegExp'),
{
    defineKey,
    deleteKeys
} = require('../object'),
{
    split,
    capitalizeName
} = require('../string');

class ApplicationBinCode extends BinCode{

    generateCaller(){

        let me = this,
            scope = me.scope,
            type = me.project.get(`scope.bin.${scope}.${encode(me.suffix)}`) ;

        let path = me.path;

        if(path){

            switch(type){
                
                case 'text':
    
                    return readTextFile(path) ;
    
                case 'json':
    
                    return readJSONFile(path) ;
    
                case 'bin':
    
                    path = join(this.project.BIN_PATH , me.scope , `${me.name}.js`) ;
                
                    if(is_file(path)){
            
                        return module_require(path) ;
                    }
            }
        }   
    }
}

exports.BinCode = ApplicationBinCode ;

class LibraryBinCode extends BinCode{

    generateCaller(){

        let me = this,
        {
            fullName
        } = me ;

        let libraries = me.project.LIBRARIES ;

        for(let library of libraries){

            let {
                include
            } = library ;
    
            if(include){
    
                return include(fullName) ;
            
            }
        }
    }
}

exports.LibraryBinCode = LibraryBinCode ;

class ApplicationSourceCode extends SourceCode{

    get meta(){

        return defineKey(this , '$meta' , 'generateMeta') ;
    }

    generateMeta(){

        let me = this,
            code = me.code ;
        
        if(is_string(code)){

            let match = code.trim().match(textCodeMetaRe) ;

            if(match){

                let meta = match[0] ;

                return {
                    runat:get_text_code_runat(meta),
                    scoped:get_text_code_scoped(meta),
                    imports:get_text_code_imports(meta),
                    params:get_text_code_params(meta),
                    configs:get_text_code_config_values(meta , me.project),
                    extend:get_extend_name(meta),
                    requires:get_text_code_requires(meta),
                    code
                } ;
            }
        }

        return {
            runat:'any',
            scoped:false,
            imports:[],
            params:[],
            configs:[],
            requires:[],
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

            if(code && !codes.includes(code)){

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
            '$meta'
        ]) ;
    }
}


const textCodeMetaRe = /^\/\*(?:.|[^.])+?\*\//,
    textCodeMetaParamNameRe = /^\w+(?:\.\w+)?/,
    textCodeMetaParamRestRe = /^\.{3}(\w+)/,
    textCodeMetaParamNameDefaultValueRe = /^(?:\.{3})?\w+(?:\.\w+)?\s*\=/,
    textCodeMetaParamTypeSplitRe = /\|/,
    textCodeMetaParamArrayRe = /\[\]$/,
    textCodeMetaExtendRe = /@extend\s+([^\n\r]+)/;

function get_extend_name(meta){
        
    let match = meta.match(textCodeMetaExtendRe) ;
    
    if(match){

        return match[1].trim() ;
    }
}

function get_text_code_config_values(meta , application){
    
    let textCodeMetaConfigRe = /@config\s+(\w+)\s*\=\s*([^\n\r]+)/g,
        match,
        values = {};

    while(match = textCodeMetaConfigRe.exec(meta)){

        values[match[1].trim().toUpperCase()] = application.config(match[2].trim()) ;
    }

    return values ;
}

function get_text_code_params(meta , project){

    let textCodeMetaParamRe = /@param\s+\{([^\{\}]+)\}\s+([^\n\r]+)/g,
    match,
    params = [];

    while(match = textCodeMetaParamRe.exec(meta)){

        let type = match[1].trim().toLowerCase(),
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

function get_text_code_requires(meta){

    let textCodeMetaImportRe = /@require\s+([^\n\r]+)/g,
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
            var:content.replace(/\-/ , '_').replace(/\./g , '_').toUpperCase(),
            require:content
        }) ;
    }

    let name = get_extend_name(meta) ;

    if(name){

        imports.push({
            require:name
        }) ;
    }

    return imports ;
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

    let name = get_extend_name(meta) ;

    if(name){

        imports.push({
            require:name
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

function get_import_source_codes(code , codes){
    
    let importCodes = code.importSourceCodes ;

    for(let importCode of importCodes){

        if(!codes.includes(importCode)){

            codes.splice(codes.indexOf(code) , 0 , importCode) ;

            get_import_source_codes(importCode , codes) ;
        }
    }
}

exports.SourceCode = ApplicationSourceCode ;