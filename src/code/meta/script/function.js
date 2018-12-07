const 
ScriptMeta = require('../script'),
Param = require('./function/param'),
returnTypeRe = /@return\s+\{([^\{\}]+)\}/,
textCodeMetaOnceRe = /@once/,
getDataTypes = require('../datatypes'),
{
    defineProperty
} = require('../../../object');

class FunctionMeta extends ScriptMeta{

    constructor(code){

        super(code) ;

        defineProperty(this , 'isOnce') ;
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

    getParams(){

        let 
        {
            header
        } = this,
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
            param = new Param(rawData , type),
            {
                name,
                parentParamName
            } = param;

            if(parentParamName && params.hasOwnProperty(parentParamName)){

                params[parentParamName].add(param) ;
            
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
            items
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

                names.push(name) ;
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
            paramNames,
            paramFullNames,
            fragmentImportAllCodeDefinition,
            fragmentImportAllCodeAssignment,
            isAsync,
            isOnce
        } = this,
        code;

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

            let initLockedVariableName = `var_init_locked_${Date.now()}` ;

            code = `(() =>{

                ${fragmentImportAllCodeDefinition}

                let ${initLockedVariableName} = false ;

                ${generate_body(body , hasMain , paramNames , isAsync)}

                return ${isAsync ? 'async ' : ''}function(${paramFullNames}){

                    if(!${initLockedVariableName}){

                        ${fragmentImportAllCodeAssignment}

                        ${initLockedVariableName} = true ;
                    }

                    return ${isAsync ? 'await ' : ''}main.call(this , ${paramNames}) ;
                } ;

            })()` ;
        }

        if(isOnce){

            let time = Date.now(),
                onceLockedVariableName = `var_once_locked_${time}`,
                onceValueVariableName = `var_once_value_${time}`;

            return `(() =>{

                const main = ${code} ;

                let ${onceLockedVariableName} = false ;

                return ${isAsync ? 'async ' : ''}function(){

                    if(!${onceLockedVariableName}){

                        ${onceValueVariableName} = ${isAsync ? 'await ' : ''}main.apply(this , arguments) ;

                        ${onceLockedVariableName} = true ;
                    }

                    return ${onceValueVariableName} ;
                } ;

            })()` ;

        }

        return code ;
    }
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
    defaultValue
}){

    if(defaultValue){

        return `${name} = ${defaultValue}` ;
    }

    return name ;
}

module.exports = function(code){

    if(arguments.length){

        return new FunctionMeta(code) ;
    }

    return FunctionMeta ;
}