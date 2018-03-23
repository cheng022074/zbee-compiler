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

            result.push(`${name}(){
                ${apply('code.generate.function.overload' , {
                    functions:methods[name]
                })}
            }`) ;
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