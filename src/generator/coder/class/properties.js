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

        let nodes = selectNodes(el , 'property'),
            result = [];

        for(let node of nodes){

            let prefix = `${node.getAttribute('static') === 'yes' ? 'static ' : ''}`,
                name = node.getAttribute('name');

            if(node.hasAttribute('getter')){

                let implement = `include('${node.getAttribute('getter')}').call(this) ;` ;

                if(node.getAttribute('once') === 'yes'){

                    result.push(`${prefix} get ${name}(){
                        let me = this,
                            name = '__${name}_value__';
                        if(!me.hasOwnProperty(name)){
                            me[name] = ${implement}
                        }
                        return me[name];
                    }`) ;
                
                }else{

                    result.push(`${prefix} get ${name}(){
                        return ${implement};
                    }`) ;
                }

            }else if(node.hasAttribute('setter')){

                let implement = `include('${node.getAttribute('setter')}').call(this , value) ;` ;

                if(node.getAttribute('once') === 'yes'){

                    result.push(`${prefix} set ${name}(value){
                        let me = this,
                            name = '__${name}_locked__';
                        if(!me.hasOwnProperty(name)){
                            ${implement}
                            me[name] = true ;
                        }
                    }`) ;
                
                }else{

                    result.push(`${prefix} set ${name}(value){
                        ${implement}
                    }`) ;
                }
            }
        }

        return result.join('') ;
    }

    applyImports(){

        let {
            el
        } = this,
        nodes = selectNodes(el , 'method'),
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
        methodEls = selectNodes(el , 'method'),
        result = [];

        for(let methodEl of methodEls){

            let params = [],
                paramNodes = selectNodes(methodEl , 'param');

            for(let paramNode of paramNodes){

                params.push({
                    name:paramNode.getAttribute('name'),
                    type:paramNode.getAttribute('type'),
                    optional:paramNode.getAttribute('optional') === 'yes',
                    description:paramNode.getAttribute('description') || ''
                }) ;
            }

            result.push({
                name:methodEl.getAttribute('implement'),
                description:methodEl.getAttribute('description') || '',
                params,
                suffix:'.fn.js'
            }) ;
        }

        return result ;
    }
}