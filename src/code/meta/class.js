const 
FunctionMeta = require('./script/function')(),
{
    load
} = require('../../json'),
{
    simpleObject:isObject,
    string:isString
} = require('../../is'),
{
    defineProperties
} = require('../../object'),
{
    toCamelCase
} = require('../../name');

class Meta extends FunctionMeta{

    constructor(code){

        super(code) ;

        let me = this ;

        me.data = load(code.path) ;

        defineProperties(me , [
            'singleton',
            'isClass'
        ]) ;
    }

    getRawBody(){

        let {
            data,
            code
        } = this,
        {
            fullName
        } = code,
        {
            processConstructorParams = false,
            constructor,
            extend,
            extendSource = 'zbee',
            staticMethods = [],
            staticProperties = {},
            methods = [],
            properties = {}
        } = data,
        extendCode = '';

        if(extend){

            switch(extendSource){

                case 'node':
    
                    extendCode = `const extendTarget = require('${extend}');` ;
    
                    break;
    
                case 'zbee':
    
                    extendCode = `const extendTarget = include('${extend}')();` ;
            }
        }

        let mainClassVariableName = `main_class_${Date.now()}` ;

        return `

            let ${mainClassVariableName} ;

            function getMainClass(){

                if(${mainClassVariableName}){

                    return ${mainClassVariableName} ;
                }

                ${extendCode}
                return ${mainClassVariableName} = class ${extend ? 'extends extendTarget' : ''}{

                    ${generate_methods(fullName , staticMethods , true)}

                    ${generate_properties(fullName , staticProperties , true)}

                    ${generate_constructor(fullName , constructor , processConstructorParams , !!extend)}

                    ${generate_methods(fullName , methods)}

                    ${generate_properties(fullName , properties)}
                }

            }
        ` ;
    }

    getIsOnce(){

       return this.singleton ;
    }

    getSingleton(){

        let {
            data
        } = this,
        {
            singleton
        } = data ;

        return !!singleton ;
    }

    getIsClass(){

        return this.data.class === true ;
    }

    getImports(){

        let
        imports = [],
        {
            data,
            code
        } = this,
        {
            extend,
            extendSource,
            processConstructorParams = false,
            constructor,
            staticMethods = [],
            staticProperties = {},
            methods = [],
            properties = {}
        } = data,
        {
            fullName
        } = code;

        import_extend(imports , extend , extendSource) ;

        import_properties(imports , fullName , staticProperties , true) ;

        import_methods(imports , fullName , staticMethods , true) ;

        import_constructor(imports , fullName , constructor , processConstructorParams) ;

        import_properties(imports , fullName , properties) ;

        import_methods(imports , fullName , methods) ;

        return imports ;
    }

    getParams(){

        return [] ;
    }

    toString(){

        let {
            body,
            isOnce,
            isClass
        } = this;

        body = body.toString() ;

        if(isOnce){

            return `(() =>{

                ${body}

                let target ;
    
                return () =>{

                    if(!target){
    
                        return target = new (getMainClass())() ;

                    }

                    return target ;
                }
    
            })()` ;

        }else if(isClass){

            return `(() =>{

                ${body}
    
                return () =>{
    
                    return getMainClass() ;
                }
    
            })()` ;
        }

        return `(() =>{

            ${body}

            return (...args) =>{

                return new (getMainClass())(...args) ;
            }

        })()` ;
    }
}

function import_constructor(imports , rootName , hasConstructor , processConstructorParams){

    if(hasConstructor){

        let target ;

        if(isString(hasConstructor)){

            target = hasConstructor ;
        
        }else{

            target = `${rootName}.constructor` ;
        }

        imports.push({
            name:toCamelCase(target),
            scoped:true,
            target
        }) ;

        if(processConstructorParams){

            imports.push({
                name:toCamelCase(`${target}.params`),
                target:`${target}.params`
            }) ;
        }
    }
}

function generate_constructor(rootName , hasConstructor , processConstructorParams , hasExtend){

    if(hasConstructor){

        let name ;

        if(isString(hasConstructor)){

            name = hasConstructor ;
        
        }else{

            name = `${rootName}.constructor` ;
        }

        return `constructor(...args){

            ${processConstructorParams ? `args = ${toCamelCase(`${name}.params`)}(args)` : ''}

            ${hasExtend ? 'super(...args)' : ''}

            ${toCamelCase(name)}(...args) ;

        }` ;
    }

    return '' ;
}

function import_methods(imports , rootName , methods , isStatic = false){

    let prefix = `${isStatic ? 'static_' : ''}method_` ;

    for(let method of methods){

        let name,
            target;

        if(isObject(method)){

            name = method.name ;

            target = method.impl ;
        
        }else{

            name = method ;

            target = `${rootName}.${isStatic ? 'static.' : ''}${method}` ;
        }

        imports.push({
            name:toCamelCase(target),
            scoped:true,
            target
        }) ;
    }
}

function generate_methods(rootName , methods , isStatic = false){

    let result = [] ;

    for(let method of methods){

        let name,
            impl;

        if(isObject(method)){

            name = method.name ;

            impl = method.impl ;
        
        }else{

            name = method ;

            impl = `${rootName}.${isStatic ? 'static.' : ''}${method}` ;
        }

        result.push(`${isStatic ? 'static ' : ''}${name}(...args){

            return ${toCamelCase(impl)}(...args) ;

        }`) ;
    }

    return result.join('\n') ;

}

function import_extend(imports , extend , extendSource = 'zbee'){

    if(extend && extendSource === 'zbee'){

        imports.push({
            name:toCamelCase(extend),
            target:extend
        }) ;
    }
}

function import_properties(imports , rootName , properties , isStatic = false){

    let names = Object.keys(properties);

    for(let name of names){

        let value = properties[name],
            getter = `${rootName}.${isStatic ? 'static.' : ''}${name}.get`,
            setter = `${rootName}.${isStatic ? 'static.' : ''}${name}.set`;

        switch(value){

            case true:

                break ;

            case 'get':

                setter = false ;

                break ;

            case 'set':

                getter = false ;

                break ;

            default:

                if(isObject(value)){

                    setter = getter = null ;

                    if(value.hasOwnProperty('set')){

                        setter = value.set ;
                    }

                    if(value.hasOwnProperty('get')){

                        getter = value.get ;
                    }
                }
        }

        if(setter){

            imports.push({
                name:toCamelCase(setter),
                scoped:true,
                target:setter
            }) ;
        }

        if(getter){

            imports.push({
                name:toCamelCase(getter),
                scoped:true,
                target:getter
            }) ;
        }
    }

}

function generate_properties(rootName , properties , isStatic = false){

    let result = [],
        names = Object.keys(properties);

    for(let name of names){

        let value = properties[name],
            getter = `${rootName}.${isStatic ? 'static.' : ''}${name}.get`,
            setter = `${rootName}.${isStatic ? 'static.' : ''}${name}.set`;

        switch(value){

            case true:

                break ;

            case 'get':

                setter = false ;

                break ;

            case 'set':

                getter = false ;

            default:

                if(isObject(value)){

                    setter = getter = null ;

                    if(value.hasOwnProperty('set')){

                        setter = value.set ;
                    }

                    if(value.hasOwnProperty('get')){

                        getter = value.get ;
                    }
                }
        }

        if(setter){

            result.push(`${isStatic ? 'static ' : ''}set ${name}(value){

                ${toCamelCase(setter)}(value) ;
    
            }`) ;
        }

        if(getter){

            result.push(`${isStatic ? 'static ' : ''}get ${name}(){

                return ${toCamelCase(getter)}() ;
    
            }`) ;
        }
    }

    return result.join('\n') ;
}

module.exports = code =>{

    return new Meta(code) ;
}