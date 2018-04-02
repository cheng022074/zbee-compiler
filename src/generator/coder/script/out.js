const {
    Coder
} = require('../../coder'),
{
    expression
} = require('../../../script/generator');

module.exports = class extends Coder{

    applyCode(){

        let {
            el
        } = this ;

        if(el.hasAttribute('value')){

            return `console.log(${expression(el.getAttribute('value'))});` ;
        
        }

        return '' ;
    }
}