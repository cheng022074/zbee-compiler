class FunctionElement extends require('../script'){

    get body(){

        let {
            children
        } = this,
        result = [];

        for(let childEl of children){

            result.push(childEl.toString()) ;
        }

        return result.join('') ;
    }

    render(){

        return `function(){${this.body}}` ;
    }

}

module.exports = () =>{

    return FunctionElement ;
} ;