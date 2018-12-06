const {
    defineCacheProperties
} = require('../object') ;

module.exports = class {

    constructor(code){

        let me = this ;

        me.code = code ;

        defineCacheProperties(me , me.getPropertyNames()) ;
    }

    getPropertyNames(){

        return [
            'body',
            'imports',
            'params'
        ] ;
    }

    applyBody(){

        return '' ;
    }

    applyImports(){

        return [] ;
    }

    applyParams(){

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

    get paramFullNames(){

        let {
            params
        } = this,
        names = [];

        for(let param of params){

            let {
                items,
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