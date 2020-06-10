const {
    parse
} = require('postcss'),
{
    defineProperties
} = require('../../../../../src/object'),
{
    normalize,
} = require('../../../../../src/name'),
doubleQuoteRe = /\"([^\"]+)\"/,
toString = require('./scss/string');

module.exports = class {

    constructor(meta , {
        scoped = false
    }){

        let me = this,
        {
            rawBody:data
        } = meta;

        me.meta = meta ;

        me.scoped = scoped ;

        me.data = parse(data).root() ;

        defineProperties(me , [
            'params',
            'imports'
        ]) ;
    }

    getImports(){

        let {
            data
        } = this,
        imports = [];

        data.each(node => {

            let {
                type,
                name,
                params
            } = node ;

            if(type === 'atrule' && name === 'import'){

                let [
                    ,
                    fullName
                ] = params.match(doubleQuoteRe) ;

                imports.push({
                    target:normalize(fullName , 'css')
                }) ;
            }

        }) ;

        return imports ;
    }

    toString(){

        return toString.call(this) ;
    }

} ;