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
                static:node.getAttribute('static') === 'yes',
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

        let names = Object.keys(methods);

        for(let name of names){

            let functions = methods[name] ;

            if(functions.length === 1){

                let {
                    implement,
                    static:isStatic
                } = functions[0] ;

                result.push(`${isStatic ? 'static ' : ''}${name}(){
                    return include('${implement}').apply(this , arguments) ;
                }`) ;

            }else{

                let functions = methods[name],
                    staticMethods = [],
                    noStaticMethods = [];

                for(let method of functions){

                    let {
                        static:isStatic
                    } = method ;

                    if(isStatic){

                        staticMethods.push(method) ;
                    
                    }else{

                        noStaticMethods.push(method) ;
                    }
                }

                if(staticMethods.length){

                    result.push(`static ${name}(){
                        ${apply('code.generate.function.overload' , {
                            functions:staticMethods
                        })}
                    }`) ;
                
                }
                
                if(noStaticMethods.length){

                    result.push(`${name}(){
                        ${apply('code.generate.function.overload' , {
                            functions:noStaticMethods
                        })}
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
                returnType:methodEl.getAttribute('type'),
                suffix:'.fn.js'
            }) ;
        }

        return result ;
    }
}