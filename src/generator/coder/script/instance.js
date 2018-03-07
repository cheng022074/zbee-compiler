const {
    Coder
} = require('../coder'),
{
    expression,
    params,
} = require('../../script/generator'),
{
    from
} = require('../../array'),
{
    selectNodes
} = require('../../xml');

module.exports = class extends Coder{

    applyCode(){

        let {
            el
        } = this ;

        return `
        var ${el.getAttribute('name')} = new (include('${el.getAttribute('class')}'))(${params(selectNodes(el , 'param'))});
        ` ;
    }

    
    applyImports(){

        return [
            this.el.getAttribute('class')
        ] ;
    }
}