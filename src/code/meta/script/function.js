const 
ScriptMeta = require('../script'),
Param = require('./function/param'),
returnTypeRe = /@return\s+\{([^\{\}]+)\}/,
textCodeMetaOnceRe = /@once/,
textCodeMetaClassRe = /@class/,
getDataTypes = require('../datatypes'),
{
    defineProperties
} = require('../../../object');

class FunctionMeta extends ScriptMeta{

    constructor(code){

        super(code) ;

        defineProperties(this , [
            'isOnce',
            'isClass'
        ]) ;
    }

    getReturnTypes(){

        let {
            header
        } = this ;

        let result = header.match(returnTypeRe) ;

        if(result){

            return getDataTypes(result[1]) ;
        }

        return super.getReturnTypes() ;
    }

    getIsOnce(){

        let {
            header
        } = this ;

        return textCodeMetaOnceRe.test(header) ;
    }

    getIsClass(){

        let {
            header
        } = this ;

        return textCodeMetaClassRe.test(header) ;
    }

    getParams(){

        let 
        me = this,
        {
            header
        } = me,
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
            param = new Param(me , rawData , type),
            {
                name,
                parentParamName
            } = param;

            if(parentParamName){

                if(params.hasOwnProperty(parentParamName)){

                    params[parentParamName].add(param) ;
                }

            }else{

                params[name] = param ;

                result.push(param) ;
            }
        }

        return result ;
    }

    get paramNames(){

        let {
            params
        } = this,
        names = [];

        for(let {
            name,
            type,
            items,
            rest
        } of params){

            if(items.length){

                let innerNames = [] ;

                for(let {
                    name
                } of items){

                    innerNames.push(name) ;
                }

                let result = innerNames.join(' , ') ;

                switch(type){

                    case 'object':

                        names.push(`{${result}}`) ;
                        
                        break ;

                    case 'array':

                        names.push(`[${result}]`) ;
                }

            }else{

                if(rest){

                    names.push(`...${name}`) ;
                
                }else{

                    names.push(name) ;
                }
            }
        }

        return names.join(' , ') ;
    }

    get paramFullNames(){

        let {
            params
        } = this,
        names = [];

        for(let param of params){

            let {
                items,
                type,
                defaultValue
            } = param ;

            if(items.length){

                let innerNames = [] ;

                for(let item of items){

                    innerNames.push(get_full_name(item)) ;
                }

                let result = innerNames.join(' , ') ;

                switch(type){

                    case 'object':

                        if(defaultValue){

                            names.push(`{${result}} = ${defaultValue}`) ;
                        
                        }else{

                            names.push(`{${result}}`) ;
                        }

                        break ;

                    case 'array':

                    if(defaultValue){

                        names.push(`[${result}] = ${defaultValue}`) ;
                    
                    }else{

                        names.push(`[${result}]`) ;
                    }
                }

            }else{

                names.push(get_full_name(param)) ;
            }
        }

        return names.join(' , ') ;
    }

    toString(){

        let {
            body,
            imports,
            configs,
            hasMain,
            isClass,
            isMainClass,
            paramNames,
            paramFullNames,
            fragmentImportAllCodeDefinition,
            fragmentImportAllCodeAssignment,
            fragmentImportAllCodeScopedAssignment,
            isAsync,
            isOnce
        } = this,
        code;

        body = body.toString() ;

        if(imports.length === 0 && configs.length === 0){

            if(hasMain){

                code = `(() =>{

                    ${body}
    
                    return main ;
    
                })()` ;
            
            }else{

                code = `${isAsync ? 'async ' : ''}function(${paramFullNames}){

                    ${body}
    
                }` ;
            }
        
        }else{

            let time = Date.now(),
                initLockedVariableName = `var_init_locked_${time}`,
                onceVariableName = `var_once_value_${time}`;

            if(!hasMain || hasMain && !isMainClass){

                let currentScopeVariableName = `var_current_scope_${time}`;

                code = `(() =>{

                    ${fragmentImportAllCodeDefinition}

                    let ${initLockedVariableName} = false,
                        ${currentScopeVariableName};

                    ${isOnce ? `let ${onceVariableName};` : ''}

                    ${generate_body(body , hasMain , paramNames , isAsync)}

                    return ${isAsync ? 'async ' : ''}function(${paramFullNames}){

                        if(!${initLockedVariableName}){

                            ${fragmentImportAllCodeAssignment}

                            ${initLockedVariableName} = true ;
                        }

                        if(${currentScopeVariableName} !== this){

                            ${fragmentImportAllCodeScopedAssignment}

                            ${currentScopeVariableName} = this ;
                        }

                        ${isOnce ? `if(${onceVariableName}){

                            return ${onceVariableName} ;

                        }` : ''}

                        return ${isOnce ? `${onceVariableName} = ` : ''}${isAsync ? 'await ' : ''}main.call(this ${paramNames ? `, ${paramNames}` : ''}) ;
                    } ;

                })()` ;
            
            }else{

                code = `(() =>{

                    ${fragmentImportAllCodeDefinition}

                    let ${initLockedVariableName} = false;

                    return function(${paramFullNames}){

                        if(!${initLockedVariableName}){

                            ${fragmentImportAllCodeAssignment}

                            ${initLockedVariableName} = true ;
                        }

                        ${generate_return_main_class(onceVariableName , isOnce , isClass , paramNames)}
                    } ;

                })()` ;
            }
        }

        return code ;
    }
}

function generate_return_main_class(onceVariableName , isOnce , isClass , paramNames){

    if(isOnce){

        return `
        if(${onceVariableName}){

            return ${onceVariableName} ;

        }

        return ${onceVariableName} = new main(${paramNames ? paramNames : ''}) ;

        ` ;
    }

    if(isClass){

        return 'return main;' ;
    }

    return `return new main(${paramNames ? paramNames : ''});`
}

function generate_body(body , hasMain , paramNames , isAsync){

    if(hasMain){

        return body ;
    }

    return `${isAsync ? 'async ' : ''}function main(${paramNames}){

        ${body}

    }` ;
}


function get_full_name({
    name,
    defaultValue,
    rest
}){

    if(defaultValue){

        return `${name} = ${defaultValue}` ;
    }

    if(rest){

        return `...${name}` ;
    }

    return name ;
}

module.exports = function(code){

    if(arguments.length){

        return new FunctionMeta(code) ;
    }

    return FunctionMeta ;
}