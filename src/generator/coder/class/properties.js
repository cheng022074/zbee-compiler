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