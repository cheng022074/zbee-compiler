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
        } = data;

        return `class main ${extend ? 'extends extend' : ''}{

            ${generate_methods(staticMethods , true)}

            ${generate_properties.call(me , fullName , staticProperties , true)}

            ${generate_constructor(constructor , extend)}

            ${generate_methods(methods)}

            ${generate_properties.call(me , fullName , properties)}

        }` ;
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

function generate_constructor(hasConstructor , isExtend){

    if(hasConstructor){

        return `constructor(...args){

            ${isExtend ? 'super(...args) ;' : ''}

            constructor.apply(this , args) ;

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
            name: `${isStatic ? 'static' : ''}_method_${name}`,
            target
        }) ;
    }
}

function generate_methods(methods , isStatic = false){

    let result = [] ;

    for(let method of methods){

        let name;

        if(isObject(method)){

            name = method.name ;
        
        }else{

            name = method ;
        }

        result.push(`${isStatic ? 'static ' : ''}${name}(...args){

            return ${`${isStatic ? 'static' : ''}_method_${name}`}.apply(this , args) ;

        }`) ;
    }

    return result.join('\n') ;

}

function import_extend(imports , extend){

    if(extend){

        imports.push({
            name:'Extend',
            value:true,
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
                name:`${isStatic ? 'static' : ''}_set_${name}`,
                target:setter
            }) ;
        }

        if(getter){

            imports.push({
                name:`${isStatic ? 'static' : ''}_get_${name}`,
                target:getter
            }) ;
        }
    }

}

function generate_properties(properties , isStatic = false){

    let result = [],
        names = Object.keys(properties),
        me = this;

    for(let name of names){

        let value = properties[name],
            getter = false,
            setter = false;

        switch(value){

            case true:

                getter = true ;

                setter = true ;

                break ;

            case 'get':

                getter = true ;

                break ;

            case 'set':

                setter = true ;

                break ;

            default:

                if(isObject(value)){

                    if(value.hasOwnProperty('set')){

                        setter = true ;
                    }

                    if(value.hasOwnProperty('get')){

                        getter = true ;
                    }
                }
        }

        if(setter){

            result.push(`${isStatic ? 'static ' : ''}set ${name}(value){

                ${`${isStatic ? 'static' : ''}_set_${name}`}.call(this , value) ;
    
            }`) ;
        }

        if(getter){

            result.push(`${isStatic ? 'static ' : ''}get ${name}(){

                return ${`${isStatic ? 'static' : ''}_get_${name}`}.call(this) ;
    
            }`) ;
        }
    }

    return result.join('\n') ;
}

module.exports = code =>{

    return new Meta(code) ;
}