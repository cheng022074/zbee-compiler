const
Element = require('../../script'),
process_expression = require('../expression');

class ParamElement extends Element{

    get value(){

        let me = this,
            value;

        if(me.hasAttribute('value')){

            value = me.getAttribute('value') ;
        
        }else if(me.hasAttribute('@text')){

            value = me.getAttribute('@text') ;
        }

        if(value){

            return process_expression(value) ;
        }
    }

    get optional(){

        return !!this.value ;
    }

    get datatype(){

        let me = this ;

        return me.hasAttribute('type') ? me.getAttribute('type') : 'mixed' ;
    }

    get name(){

        return this.getAttribute('name') ;
    }

    render(){

        let me = this,
        {
            value
        } = me;

        if(me.hasAttribute('name')){

            let {
                name
            } = me ;

            if(value){

                return `${name} = ${value}` ;
            }

            return name ;
        
        }

        throw new Error('参数定义缺少名称') ;
    }

}

module.exports = () =>{

    return ParamElement ;
} ;