const {
    parse
} = require('postcss'),
{
    defineProperties
} = require('../../../object'),
{
    normalize
} = require('../../../name');

const doubleQuoteRe = /\"([^\"]+)\"/;

module.exports = class {

    constructor(meta){

        let me = this,
        {
            rawBody:data
        } = meta;

        me.meta = meta ;

        me.data = parse(data) ;

        defineProperties(me , [
            'params',
            'imports'
        ]) ;
    }

    getImports(){

        let root = this.data.root(),
            imports = [];

        root.each(node => {

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

        return this.rawData ;
    }

} ;