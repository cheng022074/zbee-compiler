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

        return `var ${el.getAttribute('name')} = ${expression(el.getAttribute('value'))};` ;
    }

    
    applyImports(){

        return [
            this.el.getAttribute('class')
        ] ;
    }
}