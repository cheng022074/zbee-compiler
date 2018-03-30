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
        } = this,
        code = '';

        if(el.hasAttribute('var')){

            code = `var ${el.getAttribute('var')} = ` ;
        }

        if(el.hasAttribute('target')){

            return `${code}await ${el.getAttribute('target')}.${el.getAttribute('name')}(${params(selectNodes(el , 'param'))});` ;
        }

        return `${code}await include('${el.getAttribute('name')}')(${params(selectNodes(el , 'param'))});` ;
    }

    
    applyImports(){

        return [
            this.el.getAttribute('name')
        ] ;
    }
}