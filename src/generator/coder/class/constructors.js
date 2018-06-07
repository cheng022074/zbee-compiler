const {
    Coder
} = require('../../coder'),
{
    selectNodes
} = require('../../../xml'),
{
    apply
} = require('../../../template');

module.exports = class extends Coder{

    applyCode(){

        let {
            el
        } = this ;

        let nodes = selectNodes(el , 'constructor'),
            constructors = [];

        for(let node of nodes){

            let paramNodes = selectNodes(node , 'param'),
                paramTypes = [];

            for(let paramNode of paramNodes){

                paramTypes.push(paramNode.getAttribute('type')) ;
            }    

            constructors.push({
                implement:node.getAttribute('implement'),
                paramTypes
            }) ;
        }

        return `constructor(){

            ${apply('code.generate.function.overload' , {
                functions:constructors
            })}
        } ;` ;
    }

    applyImports(){

        let {
            el
        } = this,
        nodes = selectNodes(el , 'constructor'),
        imports = [];

        for(let node of nodes){

            imports.push(node.getAttribute('implement')) ;
        }

        return imports ;
    }

    applyGenerates(){

        let {
            el
        } = this,
        constructorEls = selectNodes(el , 'constructor'),
        result = [];

        for(let constructorEl of constructorEls){

            let params = [],
                paramNodes = selectNodes(constructorEl , 'param');

            for(let paramNode of paramNodes){

                params.push({
                    name:paramNode.getAttribute('name'),
                    type:paramNode.getAttribute('type'),
                    description:paramNode.getAttribute('description') || ''
                }) ;
            }

            result.push({
                name:constructorEl.getAttribute('implement'),
                description:constructorEl.getAttribute('description') || '',
                params,
                suffix:'.fn.js'
            }) ;
        }

        return result ;
    }
}