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
        } = this,
        paramNodes = selectNodes(el , 'param'),
        paramTypes = [];

        for(let paramNode of paramNodes){

            paramTypes.push(paramNode.getAttribute('type')) ;
        }

        return `constructor(){

            ${apply('code.generate.function.overload' , {
                functions:[{
                    implement:el.getAttribute('implement'),
                    paramTypes
                }]
            })}
        } ;` ;
    }

    applyImports(){

        let {
            el
        } = this;

        return [
            el.getAttribute('implement')
        ] ;
    }

    applyGenerates(){

        let {
            el
        } = this ;

        return [{
            name:el.getAttribute('implement'),
            suffix:'.fn.js'
        }] ;
    }
}