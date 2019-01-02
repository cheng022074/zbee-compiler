const ParamSet = require('./function/param/set'),
{
    unique
} = require('../../../array'),
{
    toCamelCase
} = require('../../../name');

class FunctionElement extends require('../script'){

    constructor(tag){

        super(tag) ;

        this.params = new ParamSet(this.queryAll('param')) ;

    }

    get body(){

        let result = [],
            elements = this.excludeQueryAll('param') ;

        for(let el of elements){

            result.push(el.toString()) ;
        }

        return result.join('') ;
    }

    render(){

        let {
            params,
            body
        } = this ;

        return `async function main(${params.toString()}){${body}}` ;
    }

    get imports(){

        let {
            importNames
        } = this ;

        return unique(importNames).map(process_import_name) ;
    }

}

function process_import_name(name){

    return {
        name:toCamelCase(name),
        target:name
    } ;
}

module.exports = () =>{

    return FunctionElement ;
} ;