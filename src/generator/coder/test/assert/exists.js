const {
    Coder
} = require('../../../coder'),
{
    expression
} = require('../../../../script/generator'),
{
    stringify
} = require('../../../../xml');

module.exports = class extends Coder{

    applyCode(){

        let {
            el
        } = this ;

        if(el.hasAttribute('value')){

            return `notStrictEqual(${expression(el.getAttribute('value'))} , undefined);` ;
        
        }else if(el.hasAttribute('target')){

            if(el.hasAttribute('property')){

                return `{
                    let value ;
                    try{

                        value = 

                    }catch(err){

                    }
                    notStrictEqual(${el.getAttribute('target')}.${el.getAttribute('property')} , undefined);
                }` ;
            }

            throw new Error(` ${stringify(el)} 缺少 property 属性`) ;
        }
    }
}