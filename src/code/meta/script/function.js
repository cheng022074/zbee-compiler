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
                    name,
                    rest
                } of items){

                    if(rest){

                        innerNames.push(`...${name}`) ;
                        
                    }else{

                        innerNames.push(name) ;
                    }

                    
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

        let time = Date.now(),
            initLockedVariableName = `var_init_locked_${time}`,
            onceVariableName = `var_once_value_${time}`;

        if(!hasMain || hasMain && !isMainClass){

            let currentScopeVariableName = `var_current_scope_${time}`;

            code = `(() =>{

                ${fragmentImportAllCodeDefinition}

                ${generate_var(initLockedVariableName , fragmentImportAllCodeDefinition)}

                ${generate_var(currentScopeVariableName , fragmentImportAllCodeScopedAssignment)}

                ${generate_var(onceVariableName , isOnce)}

                ${generate_body(body , hasMain , paramNames , isAsync)}

                return ${isAsync ? 'async ' : ''}function(${paramFullNames}){

                    ${generate_init_code(initLockedVariableName , fragmentImportAllCodeAssignment)}

                    ${generate_scoped_code(currentScopeVariableName , fragmentImportAllCodeScopedAssignment)}

                    ${generate_once_code(isOnce , onceVariableName , `${isAsync ? 'await ' : ''}main.call(this ${paramNames ? `, ${paramNames}` : ''})`)}
                } ;

            })()` ;
        
        }else{

            let classVariableNames = `var_class_${time}`;

            code = `(() =>{

                ${fragmentImportAllCodeDefinition}

                ${generate_var(initLockedVariableName , fragmentImportAllCodeDefinition)}

                ${generate_var(classVariableNames , true)}

                ${generate_var(onceVariableName , isOnce)}

                return function(${isClass ? '' : paramFullNames}){

                    ${generate_init_code(initLockedVariableName , fragmentImportAllCodeAssignment)}

                    ${generate_class_code(classVariableNames , body)}

                    ${generate_return_main_class(isOnce , isClass , onceVariableName , classVariableNames , paramNames)}
                } ;

            })()` ;
        }

        return code ;
    }
}

function generate_var(varName , code){

    if(code){

        return `let ${varName};` ;
    }

    return '' ;
}

function generate_once_code(isOnce , varName , code){

    if(isOnce){

        return `
        if(${varName}){

            return ${varName} ;

        }
        return ${varName} = ${code} ;
        ` ;
    }

    return `return ${code} ;` ;
}

function generate_scoped_code(varName , code){

    if(code){

        return  `
        if(!${varName} !== this){

            ${code}

            ${varName} = this ;
        }
        `;
    }

    return '' ;
}

function generate_init_code(varName , code){

    if(code){

        return  `
        if(!${varName}){

            ${code}

            ${varName} = true ;
        }
        `;
    }

    return '' ;
}

function generate_class_code(name , varName , code){

    if(code){

        return  `
        if(!${varName}){

            ${code}

            ${varName} = class extends main{

                static get __ZBEE_IS_CLASS__(){

                    return true ;
                }


                get __ZBEE_CLASS__(){

                    return ${varName} ;
                }

                get __ZBEE_CLASS_NAME__(){

                    return ${name} ;
                }

            } ;
        }
        `;
    }

    return '' ;
}

function generate_return_main_class(isOnce , isClass , onceVarName , classVarName , paramNames){

    if(isOnce){

        return `
        if(${onceVarName}){

            return ${onceVarName} ;

        }

        return ${onceVarName} = new ${classVarName}(${paramNames ? paramNames : ''}) ;
        ` ;
    }

    if(isClass){

        return `return ${classVarName};` ;
    }

    return `return new ${classVarName}(${paramNames ? paramNames : ''});`
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