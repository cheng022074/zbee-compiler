const 
FunctionMeta = require('./script/function')(),
{
    load
} = require('../../json'),
{
    simpleObject:isObject,
    string:isString
} = require('../../is');

class Meta extends FunctionMeta{

    constructor(code){

        super(code) ;

        this.data = load(code.path) ;
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
            staticMethods = [],
            staticProperties = [],
            methods = [],
            properties = []
        } = data;

        return `
            class main{

                ${generate_methods(fullName , staticMethods , true)}

                ${generate_properties(fullName , staticProperties , true)}

                ${generate_constructor(fullName , constructor)}

                ${generate_methods(fullName , methods)}

                ${generate_properties(fullName , properties)}
            }
        ` ;
    }

    getIsOnce(){

        let {
            data
        } = this,
        {
            singleton
        } = data ;

        return !!singleton ;
    }

    getImports(){

        return [] ;
    }

    getParams(){

        return [] ;
    }

    toString(){

        let {
            body,
            isOnce
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
        }

        return `(() =>{

            ${body}

            return (...args) =>{

                return new main(...args) ;
            }

        })()` ;
    }
}

function generate_constructor(rootName , hasConstructor){

    if(hasConstructor){

        let name ;

        if(isString(hasConstructor)){

            name = hasConstructor ;
        
        }else{

            name = `${rootName}.consructor` ;
        }

        return `constructor(){

            include('${name}').apply(this , arguments) ;

        }` ;
    }

    return '' ;
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

                    if(value.hasOwnProperty('set')){

                        setter = value.get ;
                    }

                    if(value.hasOwnProperty('get')){

                        getter = value.set ;
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