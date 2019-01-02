module.exports = class {

    constructor(paramElements , isNormal = true){

        let me = this ;

        me.elements = paramElements ;

        me.$isNormal = isNormal ;
    }

    get isNormal(){

       return this.$isNormal ;
    }

    doBeforeRender(){
    }

    toString(){

        let me = this ;

        me.doBeforeRender() ;

        let {
            elements,
            isNormal
        } = me ;

        let result = [] ;

        for(let el of elements){

            result.push(el.toString()) ;
        }

        result = result.join(',') ;

        if(!isNormal){

            return `{${result}}` ;
        }
        
        return result ;
    }
}