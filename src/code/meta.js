const {
    defineProperties
} = require('../object'),
Body = require('./meta/body');

class Meta{

    constructor(code){

        let me = this ;

        me.code = code ;

        defineProperties(me , me.getPropertyNames()) ;
    }

    getPropertyNames(){

        return [
            'rawBody',
            'isAsync',
            'body',
            'importNames',
            'imports',
            'configs',
            'params',
            'returnTypes',
            'hasMain'
        ] ;
    }

    getRawBody(){

        return '' ;
    }

    getBody(){

        return new Body(this.rawBody) ;
    }

    getReturnTypes(){

        return [
            'void'
        ] ;
    }

    get signatureReturnTypes(){

        return get_signature_datatypes(this.returnTypes) ;
    }

    getHasMain(){

        return this.body.hasMain ;
    }

    getIsAsync(){

        return this.body.isAsync ;
    }

    getBody(){

        return this.body.toString() ;
    }

    getImportNames(){

        let {
            imports,
            configs
        } = this,
        names = new Set();

        for(let {
            target
        } of imports){

            names.add(target) ;
        }

        for(let {
            target
        } of configs){

            names.add(target) ;
        }

        return Array.from(names) ;
    }

    getImports(){

        return [] ;
    }

    getConfigs(){

        return [] ;
    }

    getParams(){

        return [] ;
    }

    get importNames(){

        let {
            imports
        } = this,
        names = [];

        for(let {
            name
        } of imports){

            names.push(name) ;
        }

        return names ;
    }

    get paramSignatureNames(){

        let {
            params
        } = this,
        names = [];

        for(let param of params){

            let {
                name,
                type,
                items
            } = param ;

            if(items.length){

                let innerNames = [] ;

                for(let item of items){

                    innerNames.push(get_signature_name(item)) ;
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

                names.push(get_signature_name(param)) ;
            }
        }

        return names.join(' , ') ;
    }

    get fragmentImportAllCodeDefinition(){

        let result = new Set(),
        {
            imports,
            configs
        } = this;

        for(let {
            name
        } of imports){

            result.add(name) ;
        }

        for(let {
            name
        } of configs){

            result.add(name) ;
        }

        return `let ${Array.from(result).join(',')};` ;
    }

    get fragmentImportAllCodeAssignment(){

        let result = [],
        {
            imports,
            configs
        } = this;

        for(let {
            name,
            target,
            scoped
        } of imports){

            if(scoped){

                result.push(`${name} = include('${target}').bind(this);`) ;

            }else{

                result.push(`${name} = include('${target}');`) ;
            }

        }

        for(let {
            name,
            target,
            key
        } of configs){

            if(key){

                result.push(`${name} = config('${target}' , '${key}');`) ;
            
            }else{

                result.push(`${name} = config('${target}');`) ;
            }
        }

        return result.join('\n') ;
    }

    toString(){

        return '() =>{}' ;
    }
}

function get_signature_name({
    name,
    types
}){

    return `${get_signature_datatypes(types)} ${name}` ;
}

function get_signature_datatypes(types){

    return `<${types.join('|')}>` ;
}

module.exports = (...args) =>{

    if(args.length){

        return new Meta(...args) ;
    }

    return Meta ;
}