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

        return apply('code.generate.class.constructor' , {
            constructors
        }) ;
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

        let names = this.imports,
            result = [];

        for(let name of names){

            result.push({
                name,
                suffix:'.fn.js'
            }) ;
        }

        return result ;
    }
}