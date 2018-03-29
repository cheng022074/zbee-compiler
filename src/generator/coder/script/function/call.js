const {
    Coder
} = require('../../../coder'),
{
    params,
} = require('../../../../script/generator'),
{
    selectNodes
} = require('../../../../xml');

module.exports = class extends Coder{

    applyCode(){

        let {
            el
        } = this ;

        return `
        var ${el.getAttribute('var')} = include('${el.getAttribute('name')}')(${params(selectNodes(el , 'param'))});
        ` ;
    }

    
    applyImports(){

        return [
            this.el.getAttribute('name')
        ] ;
    }
}