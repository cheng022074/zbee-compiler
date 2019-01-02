const
FunctionMeta = require('./function')(),
XML = require('../../../xml'),
template_build = require('../../../template/build/xml');

class FlowMeta extends FunctionMeta{

    constructor(code){

        super(code) ;

        let template = this.template = template_build(XML.parse(super.getRawBody()).documentElement , 'template.element.script') ;

        if(template.tag !== 'function'){

            throw new Error('非法脚本流描述') ;
        }
    }

    getParams(){

        let {
            params
        } = this.template,
        result = [],
        {
            elements
        } = params;

        for(let {
            name,
            value:defaultValue,
            optional,
            datatype:type
        } of elements){

            result.push({
                name,
                type,
                optional,
                defaultValue,
                items:[]
            }) ;
        }

        if(!params.isNormal){

            return [{
                name:'config',
                type:'object',
                items:result
            }] ;
        }

        return result ;
    }

    getImports(){

        return this.template.imports ;
    }

    getHeader(){

        let {
            elements
        } = this.template.params,
        result = [];

        for(let {
            name,
            value,
            optional,
            datatype
        } of elements){

            let item = [
                `@param {${datatype}} `
            ] ;

            if(optional){

                item.push('[') ;

                if(value){

                    item.push(`${name} = ${value}`) ;
                
                }else{

                    item.push(name) ;
                }

                item.push(']') ;

            }else{

                item.push(name) ;
            }

            result.push(item.join('')) ;
        }

        return result.join('\n') ;
    }

    getRawBody(){

        return this.template.toString() ;
    }
}

module.exports = function(code){

    if(arguments.length){

        return new FlowMeta(code) ;
    }

    return FlowMeta ;
}