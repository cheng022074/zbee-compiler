const {
    defineCacheProperties,
    defineCacheProperty
} = require('../object'),
{
    unique
} = require('../array'),
{
    selectNodes,
    stringify
} = require('../xml');

class Coder {

   constructor(el , generator){

        let me = this ;

        me.el = el ;

        me.generator = generator ;

        defineCacheProperties(me , [
            'initCode',
            'code',
            'imports',
            'generates'
        ]) ;
   }

   applyGenerates(){

        return [] ;
   }

   applyImports(){

        return [] ;
   }
} ;

exports.Coder = Coder ;

class EmptyCoder extends Coder{

    applyInitCode(){

        return '' ;
    }

    applyCode(){

        return '' ;
    }
}

Coder.empty = new EmptyCoder ;

class ContainerCoder extends Coder{

    constructor(el , generator){

        super(el , generator) ;

        defineCacheProperty(this , 'items') ;
    }

    getXPathForQueryItems(){

        return '*' ;
    }

    applyItems(){

        let me = this,
        {
            el,
            generator
        } = me,
        items = [];

        let nodes = selectNodes(el , me.getXPathForQueryItems()) ;

        for(let node of nodes){

            items.push(generator.getCoder(node)) ;
        }

        return items ;
    }

    applyInitCode(){

        return getCode.call(this , 'initCode') ;
    }

    applyCode(){

        return getCode.call(this , 'code') ;
    }

    getImports(){

        return [] ;
    }

    applyImports(){

        let me = this,
            imports = [],
            {
                items
            } = me;

        imports.push(...me.getImports()) ;

        for(let item of items){

            imports.push(...item.imports) ;
        }

        return unique(imports) ;
    }

    getGenerates(){

        return [] ;
    }

    applyGenerates(){

        let me = this,
            generates = [],
            {
                items
            } = me;

        generates.push(...me.getGenerates()) ;

        for(let item of items){

            generates.push(...item.generates) ;
        }

        return generates ;
    }
}

exports.ContainerCoder = ContainerCoder ;

function getCode(name){

    let {
        items
    } = this,
    result = [];

    for(let item of items){

        result.push(item[name]) ;
    }

    return result.join('\n') ;
}