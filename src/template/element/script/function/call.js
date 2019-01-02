class CallFunctionElement extends require('../script'){

    withParamElements(){

        return [] ;
    }

    render(){

        return `function(){${this.body}}` ;
    }

}

module.exports = () =>{

    return CallFunctionElement ;
} ;