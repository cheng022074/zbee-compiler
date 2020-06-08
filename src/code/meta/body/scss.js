const {
    parse
} = require('postcss'),
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

        let {
            data
        } = this,
        root = data.clone() ;

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
                ] = params.match(doubleQuoteRe),
                {
                    folder,
                    name
                } = nameParse(fullName , 'css');

                if(folder === 'css'){

                    node.params = `"${toImportCSSFileName(name)}"` ;
                
                }else{

                    root.removeChild(node) ;
                }
            }

        }) ;

        return root.toString() ;
    }

} ;