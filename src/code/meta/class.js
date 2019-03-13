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
} = require('../../object');

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
            constructor,
            extend,
            extendSource,
            staticMethods = [],
            staticProperties = {},
            methods = [],
            properties = {}
        } = data,
        extendCode = '';

        switch(extendSource){

            case 'node':

                extendCode = `const extendTarget = require('${extend}');` ;

                break;

            case 'es6':

                extendCode = `import extendTarget from '${extend}';` ;

                break ;

            case 'zbee':

                extendCode = `const extendTarget = include('${extend}')();` ;
        }

        return `
            ${extendSource}
            class main ${extendCode ? 'extends extendTarget' : ''}{

                ${generate_methods(fullName , staticMethods , true)}

                ${generate_properties(fullName , staticProperties , true)}

                ${generate_constructor(fullName , constructor)}

                ${generate_methods(fullName , methods)}

                ${generate_properties(fullName , properties)}
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
            constructor,
            staticMethods = [],
            staticProperties = {},
            methods = [],
            properties = {}
        } = data,
        {
            fullName
        } = code;

        import_properties(imports , fullName , staticProperties , true) ;

        import_methods(imports , fullName , staticMethods , true) ;

        import_constructor(imports , fullName , constructor) ;

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
    
                        return target = new main() ;

                    }

                    return target ;
                }
    
            })()` ;

        }else if(isClass){

            return `(() =>{

                ${body}
    
                return () =>{
    
                    return main ;
                }
    
            })()` ;
        }

        return `(() =>{

            ${body}

            return (...args) =>{

                return new main(...args) ;
            }

        })()` ;
    }
}

function import_constructor(imports , rootName , hasConstructor){

    if(hasConstructor){

        let target ;

        if(isString(hasConstructor)){

            target = hasConstructor ;
        
        }else{

            target = `${rootName}.constructor` ;
        }

        imports.push({
            name:'constructor',
            target
        }) ;
    }

}

function generate_constructor(rootName , hasConstructor){

    if(hasConstructor){

        let name ;

        if(isString(hasConstructor)){

            name = hasConstructor ;
        
        }else{

            name = `${rootName}.constructor` ;
        }

        return `constructor(){

            include('${name}').apply(this , arguments) ;

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
            name:`${prefix}${name}`,
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

        result.push(`${isStatic ? 'static ' : ''}${name}(){

            return include('${impl}').apply(this , arguments) ;

        }`) ;
    }

    return result.join('\n') ;

}

function import_properties(imports , rootName , properties , isStatic = false){

    let prefix = `${isStatic ? 'static_' : ''}property_`,
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
                name:`${prefix}${name}_set`,
                target:setter
            }) ;
        }

        if(getter){

            imports.push({
                name:`${prefix}${name}_get`,
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

                include('${setter}').call(this , value) ;
    
            }`) ;
        }

        if(getter){

            result.push(`${isStatic ? 'static ' : ''}get ${name}(){

                return include('${getter}').call(this) ;
    
            }`) ;
        }
    }

    return result.join('\n') ;
}

module.exports = code =>{

    return new Meta(code) ;
}