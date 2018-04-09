const {
    Coder
} = require('../../../coder'),
{
    expression
} = require('../../../../script/generator');

module.exports = class extends Coder{

    applyCode(){

        let {
            el
        } = this ;

        return `notStrictEqual(${expression(el.getAttribute('value'))} , undefined);` ;
    }
}