const {
    ContainerCoder
} = require('../../coder'),
{
    expression
} = require('../../../script/generator');

module.exports = class extends ContainerCoder{

    applyCode(){

        let {
            el
        } = this ;

        if(el.hasAttribute('var') && el.hasAttribute('items')){

            return `for(let ${el.getAttribute('var')} of ${expression(el.getAttribute('items'))}){
                ${super.applyCode()}
            }` ;
        
        }

        return '' ;
    }
}