const {
    Coder
} = require('../../../../coder'),
{
    expression,
} = require('../../../../../script/generator');

module.exports = class extends Coder{

    applyCode(){

        let {
            el
        } = this ;

        return `
        deepStrictEqual(${el.getAttribute('name')}.${el.getAttribute('property')} , ${expression(el.getAttribute('value'))});
        ` ;
    }
}