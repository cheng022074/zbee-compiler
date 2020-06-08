const {
    JSDOM
} = require('jsdom'),
{
    defineProperties
} = require('../../../object'),
{
    normalize,
    toImportCSSFileName,
    parse:nameParse
} = require('../../../name');

const doubleQuoteRe = /\"([^\"]+)\"/;

module.exports = class {

    constructor(meta){

        let me = this,
        {
            rawBody:data
        } = meta;

        me.meta = meta ;

        me.data = new JSDOM(data) ;

        defineProperties(me , [
            'params',
            'imports'
        ]) ;
    }

    getImports(){

        let {
            head:headEl
        } = this.data.window.document,
        styleEls = Array.from(headEl.querySelectorAll('style[import]')),
        imports = [];

        for(let styleEl of styleEls){

            imports.push({
                target:normalize(styleEl.getAttribute('import') , 'css')
            }) ;
        }

        return imports ;
    }

    toString(){

       let {
           data
       } = this ;

       return data.serialize() ;
    }

} ;