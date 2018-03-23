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

            include('${el.getAttribute('implement')}').apply(this , arguments) ;
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
        } = this,
        params = [],
        paramNodes = selectNodes(el , 'param');

        for(let paramNode of paramNodes){

            params.push({
                name:paramNode.getAttribute('name'),
                type:paramNode.getAttribute('type'),
                description:paramNode.getAttribute('description') || ''
            }) ;
        }

        return [{
            name:el.getAttribute('implement'),
            description:el.getAttribute('description') || '',
            params,
            suffix:'.fn.js'
        }] ;
    }
}