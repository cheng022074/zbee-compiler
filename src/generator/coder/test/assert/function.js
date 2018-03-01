const {
    Coder
} = require('../../../coder'),
{
    expression,
    params,
} = require('../../../../script/generator'),
{
    from
} = require('../../../../array'),
{
    selectNodes
} = require('../../../../xml');

module.exports = class extends Coder{

    applyCode(){

        let {
            el
        } = this ;

        return `
        deepStrictEqual(include('${el.getAttribute('name')}')(${params(selectNodes(el , 'param'))}) , ${expression(el.getAttribute('value'))});
        ` ;
    }
}