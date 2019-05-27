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
getParams = require('./script/function/params');

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
            data
        } = me,
        {
            constructor,
            mixin,
            extend,
            mixins = [],
            staticMethods = [],
            staticProperties = {},
            methods = [],
            properties = {}
        } = data ;

        if(mixin === true){

            return `function main(extend){

                        return class extends extend{

                            ${generate_methods(staticMethods , true)}
                
                            ${generate_properties(staticProperties , true)}
                
                            ${generate_constructor(constructor , true)}
                
                            ${generate_methods(methods)}
                
                            ${generate_properties(properties)}
                
                        }

                }` ;
        }


        let mixinCodes = [];

        for(let mixin of mixins){

            mixinCodes.push(`include('${mixin}')`) ;
        }
  
        return `class main ${extend || mixins.length !== 0 ? `extends mixins({extend , mixins:[${mixinCodes.join(',')}]})` : ''}{

            ${generate_methods(staticMethods , true)}

            ${generate_properties(staticProperties , true)}

            ${generate_constructor(constructor , extend || mixins.length !== 0)}

            ${generate_methods(methods)}

            ${generate_properties(properties)}

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

    getParams(){

        let me = this,
        {
            isClass,
            data
        } = me,
        {
            params,
            mixin
        } = data;

        if(mixin === true){

            return getParams('extend') ;
        }

        if(isClass){

            return [] ;
        }

        return getParams(params) ;
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
            mixin,
            extend,
            mixins,
            constructor,
            staticMethods = [],
            staticProperties = {},
            methods = [],
            properties = {}
        } = data,
        {
            fullName
        } = code;

        import_mixins.call(me , imports , mixins) ;

        if(mixin !== true){

            import_extend.call(me , imports , extend) ;
        }

        import_properties.call(me , imports , fullName , staticProperties , true) ;

        import_methods.call(me , imports , fullName , staticMethods , true) ;

        import_constructor.call(me , imports , fullName , constructor) ;

        import_properties.call(me , imports , fullName , properties) ;

        import_methods.call(me , imports , fullName , methods) ;

        return imports ;
    }
}

function import_mixins(imports , mixins){

    if(mixins){

        let prefix = `mixin_${Date.now()}_`,
        {
            length
        } = mixins;

        for(let i = 0 ; i < length ; i ++){

            imports.push({
                name:`${prefix}_${i + 1}`,
                target:mixins[i]
            }) ;
        }
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
            name: `${isStatic ? 'static_' : ''}method_${name}`,
            target
        }) ;
    }
}

function generate_methods(methods , isStatic = false){

    let result = [] ;

    for(let method of methods){

        let name,
            alias;

        if(isObject(method)){

            name = method.name ;

            alias = method.alias ;
        
        }else{

            name = method ;
        }

        result.push(`${isStatic ? 'static ' : ''}${name}(...args){

            return ${`${isStatic ? 'static_' : ''}method_${name}`}.apply(this , args) ;

        }`) ;

        if(alias){

            result.push(`${isStatic ? 'static ' : ''}${alias}(...args){

                return this.${name}(...args) ;
    
            }`) ;
        }
    }

    return result.join('\n') ;

}

function import_extend(imports , extend){

    if(extend){

        imports.push({
            name:'extend',
            value:true,
            target:this.getFullName(extend)
        }) ;
    
    }else{

        imports.push({
            name:'extend',
            value:true,
            target:'class.empty'
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
                name:`${isStatic ? 'static_' : ''}set_${name}`,
                target:setter
            }) ;
        }

        if(getter){

            imports.push({
                name:`${isStatic ? 'static_' : ''}get_${name}`,
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

                ${`${isStatic ? 'static_' : ''}set_${name}`}.call(this , value) ;
    
            }`) ;
        }

        if(getter){

            result.push(`${isStatic ? 'static ' : ''}get ${name}(){

                return ${`${isStatic ? 'static_' : ''}get_${name}`}.call(this) ;
    
            }`) ;
        }
    }

    return result.join('\n') ;
}

module.exports = code =>{

    return new Meta(code) ;
}