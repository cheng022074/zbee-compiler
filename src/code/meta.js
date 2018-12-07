const {
    defineProperties
} = require('../object'),
getDataTypes = require('./meta/datatypes');

class Meta{

    constructor(code){

        let me = this ;

        me.code = code ;

        defineProperties(me , me.getPropertyNames()) ;
    }

    getPropertyNames(){

        return [
            'body',
            'importNames',
            'imports',
            'configs',
            'params',
            'returnTypes'
        ] ;
    }

    getReturnTypes(){

        return [
            'void'
        ] ;
    }

    get signatureReturnTypes(){

        return get_signature_datatypes(this.returnTypes) ;
    }

    getBody(){

        return '' ;
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

                let result = innerNames.join(',') ;

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

                let result = innerNames.join(',') ;

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

        return names ;
    }
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