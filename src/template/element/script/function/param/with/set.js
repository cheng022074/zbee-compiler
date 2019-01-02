const ParamSet = require('../set') ;

module.exports = class extends ParamSet{

    get isNormal(){

        let {
            elements
        } = this ;

        for(let el of elements){

            if(!el.hasAttribute('name')){

                return true ;
            }
        }

        return false ;
    }

    doBeforeRender(){

        let {
            isNormal,
            elements
        } = this ;

        if(isNormal){

            for(let el of elements){

                el.removeAttribute('name') ;
            }
        }
    }
}