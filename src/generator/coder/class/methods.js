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

        let nodes = selectNodes(el , 'method'),
            methods = {},
            result = [];

        for(let node of nodes){

            let paramNodes = selectNodes(node , 'param'),
                name = node.getAttribute('name'),
                paramTypes = [];

            for(let paramNode of paramNodes){

                paramTypes.push(paramNode.getAttribute('type')) ;
            }

            let method = {
                implement:node.getAttribute('implement'),
                paramTypes
            } ;

            if(methods.hasOwnProperty(name)){

                methods[name].push(method) ;
            
            }else{

                methods[name] = [
                    method
                ] ;
            }
        }

        let names = Object.keys(methods) ;

        for(let name of names){

            let functions = methods[name] ;

            if(functions.length === 1){

                result.push(`${name}(){
                    include('${functions[0].implement}').apply(this , arguments) ;
                }`) ;

            }else{

                result.push(`${name}(){
                    ${apply('code.generate.function.overload' , {
                        functions:methods[name]
                    })}
                }`) ;
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