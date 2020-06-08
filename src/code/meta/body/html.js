const {
    JSDOM
} = require('jsdom'),
{
    defineProperties
} = require('../../../object'),
{
    normalize,
    toImportCSSFileName,
    parse
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

       let data = new JSDOM(this.data.serialize()),
       {
            document
       } = data.window,
       {
           head:headEl
       } = document,
       styleEls = Array.from(headEl.querySelectorAll('style[import]'));

       for(let styleEl of styleEls){

            let linkEl = document.createElement('link') ;

            linkEl.setAttribute('rel' , 'stylesheet') ;

            let {
                name
            } = parse(styleEl.getAttribute('import') , 'css') ;

            linkEl.setAttribute('href' , `../css/${toImportCSSFileName(name)}`) ;

            headEl.insertBefore(linkEl , styleEl) ;

            headEl.removeChild(styleEl) ;
       }

       return data.serialize() ;
    }

} ;