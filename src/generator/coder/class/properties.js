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

            let prefix = node.getAttribute('static') === 'yes' ? 'static ' : '',
                name = node.getAttribute('name');

            if(node.hasAttribute('getter')){

                result.push(`${prefix} get ${name}(){
                    return include('${node.getAttribute('getter')}').call(this) ;
                }`) ;
                

            }else if(node.hasAttribute('setter')){

                result.push(`${prefix} set ${name}(value){
                    include('${node.getAttribute('setter')}').call(this , value) ;
                }`) ;
                
            }
        }

        return result.join('') ;
    }

    applyImports(){

        let {
            el
        } = this,
        nodes = selectNodes(el , 'property'),
        imports = [];

        for(let node of nodes){

            imports.push(node.getAttribute('setter')),
            imports.push(node.getAttribute('getter'));
        }

        return imports ;
    }

    applyGenerates(){

        let {
            el
        } = this,
        propertyEls = selectNodes(el , 'property'),
        result = [];

        for(let propertyEl of propertyEls){

            let description = propertyEl.getAttribute('description') || '' ;

            if(propertyEl.hasAttribute('setter')){

                result.push({
                    name:propertyEl.getAttribute('setter'),
                    description,
                    params:[{
                        name:'value',
                        type:propertyEl.getAttribute('type'),
                        description:'设置值'
                    }],
                    suffix:'.fn.js'
                }) ;
            
            }else if(propertyEl.hasAttribute('getter')){

                result.push({
                    name:propertyEl.getAttribute('getter'),
                    description,
                    params:[],
                    suffix:'.fn.js'
                }) ;
            }            
        }

        return result ;
    }
}