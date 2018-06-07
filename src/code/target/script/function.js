const Target = require('../script') ;

module.exports = class extends Target{

    applyBinCodeData(){

        let {
            scoped,
            params,
            async,
            once
        } = this.meta ;


        return Object.assign({
            scoped,
            params:process_params(params),
            paramNames:process_param_names(params),
            async,
            once
        } , super.applyBinCodeData()) ;
    }
}

function process_params(params){

    let result = [] ;

    for(let {
        name,
        defaultValue,
        items,
        type,
        rest
    } of params){

        if(defaultValue){

            result.push(`${name} = ${defaultValue}`) ;
        
        }else if(rest){

            result.push(`...${name}`) ;

        }else if(items){

            switch(type){

                case 'object':

                    result.push(`{${process_params(items)}}`) ;
            }

        }else{

            result.push(name) ;
        }
    }

    return result.join(',') ;
}

function process_param_names(params){


    let names = [] ;

    for(let {
        name,
        items,
        type,
        rest
    } of params){

        if(rest){

            names.push(`...${name}`) ;
        
        }else if(items){

            switch(type){

                case 'object':

                    names.push(`{${process_param_names(items).join(',')}}`) ;
            }

        }else{

            names.push(name) ;
        }
    }

    return names ;
}