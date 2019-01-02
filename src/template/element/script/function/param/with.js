const ParamElement = require('../param') ;

class WithParamElement extends ParamElement{

    render(){

        let me = this,
        {
            value
        } = me;

        if(value){

            if(me.hasAttriute('name')){

                return `${me.getAttribute('name')}:${value}` ;
            }

            return value ;
        
        }

        throw new Error('传参定义缺少值') ;
        
    }

}

module.exports = () =>{

    return WithParamElement ;
} ;