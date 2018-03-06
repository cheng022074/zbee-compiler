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
            'code',
            'imports'
        ]) ;
   }

   applyImports(){

        return [] ;
   }
} ;

exports.Coder = Coder ;

class EmptyCoder extends Coder{

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

    applyCode(){

        let {
            items
        } = this,
        result = [];

        for(let item of items){

            result.push(item.code) ;
        }

        return result.join('\n') ;
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
}

exports.ContainerCoder = ContainerCoder ;