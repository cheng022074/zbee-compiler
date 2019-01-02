const ParamSet = require('./function/param/set') ;

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

        return `async function(${params.toString()}){${body}}` ;
    }

}

module.exports = () =>{

    return FunctionElement ;
} ;