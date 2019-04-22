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

        let me = this,
        {
            data,
            code
        } = me,
        {
            fullName
        } = code,
        {
            constructor,
            extend,
            staticMethods = [],
            staticProperties = {},
            methods = [],
            properties = {}
        } = data,
        extendCode = '';

        if(extend){
    
            extendCode = `const extendTarget = include('${me.getFullName(extend)}');` ;
            
        }else{

            extendCode = "const extendTarget = include('class.empty') ;" ;
        }

        let mainClassVariableName = `main_class_${Date.now()}` ;

        return `

            let ${mainClassVariableName} ;

            function getMainClass(){

                if(${mainClassVariableName}){

                    return ${mainClassVariableName} ;
                }

                ${extendCode}
                return ${mainClassVariableName} = class extends extendTarget{

                    ${generate_methods.call(me , fullName , staticMethods , true)}

                    ${generate_properties.call(me , fullName , staticProperties , true)}

                    ${generate_constructor.call(me , fullName , constructor)}

                    ${generate_methods.call(me , fullName , methods)}

                    ${generate_properties.call(me , fullName , properties)}
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
        imports = [{
            name:'class_empty',
            target:'class.empty'
        }],
        me = this,
        {
            data,
            code
        } = me,
        {
            extend,
            constructor,
            staticMethods = [],
            staticProperties = {},
            methods = [],
            properties = {}
        } = data,
        {
            fullName
        } = code;

        import_extend.call(me , imports , extend) ;

        import_properties.call(me , imports , fullName , staticProperties , true) ;

        import_methods.call(me , imports , fullName , staticMethods , true) ;

        import_constructor.call(me , imports , fullName , constructor) ;

        import_properties.call(me , imports , fullName , properties) ;

        import_methods.call(me , imports , fullName , methods) ;

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

function import_constructor(imports , rootName , hasConstructor){

    if(hasConstructor){

        let target ;

        if(isString(hasConstructor)){

            target = this.getFullName(hasConstructor) ;
        
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

            name = this.getFullName(hasConstructor) ;
        
        }else{

            name = `${rootName}.constructor` ;
        }

        return `constructor(...args){

            super(...args) ;

            include('${name}').apply(this , args) ;

        }` ;
    }

    return '' ;
}

function import_methods(imports , rootName , methods , isStatic = false){

    for(let method of methods){

        let name,
            target;

        if(isObject(method)){

            name = method.name ;

            target = this.getFullName(method.impl) ;
        
        }else{

            name = method ;

            target = `${rootName}.${isStatic ? 'static.' : ''}${method}` ;
        }

        imports.push({
            name:isStatic ? `static_method_${name}` : `method_${name}`,
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

            impl = this.getFullName(method.impl) ;
        
        }else{

            name = method ;

            impl = `${rootName}.${isStatic ? 'static.' : ''}${method}` ;
        }

        result.push(`${isStatic ? 'static ' : ''}${name}(...args){

            return include('${impl}').apply(this , args) ;

        }`) ;
    }

    return result.join('\n') ;

}

function import_extend(imports , extend){

    if(extend){

        imports.push({
            name:'extend',
            target:this.getFullName(extend)
        }) ;
    }
}

function import_properties(imports , rootName , properties , isStatic = false){

    let names = Object.keys(properties),
        me = this;

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

                        setter = me.getFullName(value.set) ;
                    }

                    if(value.hasOwnProperty('get')){

                        getter = me.getFullName(value.get) ;
                    }
                }
        }

        if(setter){

            imports.push({
                name:isStatic ? `static_set_${name}` : `set_${name}`,
                target:setter
            }) ;
        }

        if(getter){

            imports.push({
                name:isStatic ? `static_get_${name}` : `get_${name}`,
                target:getter
            }) ;
        }
    }

}

function generate_properties(rootName , properties , isStatic = false){

    let result = [],
        names = Object.keys(properties),
        me = this;

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

                        setter = me.getFullName(value.set) ;
                    }

                    if(value.hasOwnProperty('get')){

                        getter = me.getFullName(value.get) ;
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