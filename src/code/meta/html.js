const
{
    readTextFile
} = require('../../fs'),
{
    normalize
} = require('../../name'),
{
    defineCacheProperties
} = require('../../object'),
{
    parse,
    stringify,
    format
} = require('../../html') ;

module.exports = class {

    constructor(code){

        let me = this ;

        me.target = code ;

        defineCacheProperties(me , [
            'data',
            'importScriptNames',
            'importCSSNames',
            'code'
        ]) ;
    }

    applyData(){

        return parse(readTextFile(this.target.path));
    }

    applyImportScriptNames(){

        let {
            head
        } = this.data.window.document,
        scriptEls = head.querySelectorAll('script[@import]'),
        names = [];

        for(let scriptEl of scriptEls){

            names.push(scriptEl.getAttribute('import')) ;
        }

        return names ;
    }

    applyImportCSSNames(){

        let {
            head
        } = this.data.window.document,
        styleEls = head.querySelectorAll('style[@import]'),
        names = [];

        for(let styleEl of styleEls){

            names.push(normalize(styleEl.getAttribute('import') , 'css')) ;
        }

        return names ;
    }

    applyCode(){

        let {
            documentElement
        } = this.data.window.document ;

        let rootEl = documentElement.cloneNode(true) ;

        remove(rootEl.querySelectorAll('head > style[import]')) ;

        remove(rootEl.querySelectorAll('head > script[import]')) ;

        return format(stringify(rootEl)) ;
    }

}

function remove(els){

    for(let el of els){

        el.remove() ;
    }
}