const
Element = require('../../../element'),
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

    render(){

        let me = this,
        {
            value
        } = me;

        if(me.hasAttribute('name')){

            let name = me.getAttribute('name') ;

            if(value){

                return `${name} = ${value}` ;
            }

            return name ;
        
        }else{

            throw new Error('参数定义缺少名称') ;
        }
    }

}

module.exports = () =>{

    return ParamElement ;
} ;