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
} = require('../../html'),
{
    clearEmpty
} = require('../../array');

module.exports = class {

    constructor(code){

        let me = this ;

        me.target = code ;

        defineCacheProperties(me , [
            'data',
            'importScriptNames',
            'importCSSNames',
            'importNames',
            'code'
        ]) ;
    }

    applyData(){

        return parse(readTextFile(this.target.path));
    }

    applyImportNames(){

        let {
            importScriptNames,
            importCSSNames
        } = this ;

        return [
            ...importScriptNames,
            ...importCSSNames
        ] ;
    }

    applyImportScriptNames(){

        let {
            head
        } = this.data.window.document,
        scriptEls = head.querySelectorAll('script[import]'),
        names = [];

        for(let scriptEl of scriptEls){

            names.push(scriptEl.getAttribute('import')) ;
        }

        return clearEmpty(names) ;
    }

    applyImportCSSNames(){

        let {
            head
        } = this.data.window.document,
        styleEls = head.querySelectorAll('style[import]'),
        names = [];

        for(let styleEl of styleEls){

            names.push(normalize(styleEl.getAttribute('import') , 'css')) ;
        }

        return clearEmpty(names) ;
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