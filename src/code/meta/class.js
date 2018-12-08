const 
FunctionMeta = require('./script/function')(),
{
    load
} = require('../../json');

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
    
                        return new main() ;

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

        return `constructor(){

            include('${rootName}.consructor').apply(this , arguments) ;

        }` ;
    }

    return '' ;
}

function generate_methods(rootName , methods , isStatic = false){

    let result = [] ;

    for(let method of methods){

        result.push(`${isStatic ? 'static ' : ''}${method}(){

            return include('${rootName}.${isStatic ? 'static.' : ''}${method}').apply(this , arguments) ;

        }`) ;
    }

    return result.join('\n') ;

}

function generate_properties(rootName , properties , isStatic = true){

    let result = [],
        names = Object.keys(properties);

    for(let name of names){

        let value = properties[name],
            getter = false,
            setter = false;

        switch(value){

            case true:

                getter = true,
                setter = true ;

                break ;

            case 'get':

                getter = true ;

                break ;

            case 'set':

                setter = true ;
        }

        if(setter){

            result.push(`${isStatic ? 'static ' : ''}set ${name}(value){

                include('${rootName}.${isStatic ? 'static.' : ''}${name}.set')(value) ;
    
            }`) ;
        }

        if(getter){

            result.push(`${isStatic ? 'static ' : ''}get ${name}(){

                return include('${rootName}.${isStatic ? 'static.' : ''}${name}.get')() ;
    
            }`) ;
        }
    }

    return result.join('\n') ;
}

module.exports = code =>{

    return new Meta(code) ;
}