const compile = require('../../compile/scss'),
{
    normalize,
    toImportCSSFileName
} = require('../../../../../src/name'),
parse = require('../../../../name/parse'),
toStylesheetName = require('../../../../name/stylesheet'),
mainRe = /^\.\-main\-/;

module.exports = class {

    constructor(meta , {
        scoped = false
    }){

        let me = this,
            styleCodeName = toStylesheetName(meta.code.fullName),
            {
                imports,
                code
            } = compile(meta.rawBody , {
            getVariableName(name){

                return `${styleCodeName}-${name}`;

            },
            getImportItem(name){

                return {
                    target:normalize(name , 'css')
                } ;
            },
            getImportFilePath(originName){

                let {
                    folder,
                    name
                } = parse(originName , 'css') ;

                return toImportCSSFileName(folder , name) ;
            },
            getRootSelector(){

                return scoped ? `.${styleCodeName}` : false;
            },

            replaceSelector(name){

                return name.replace(mainRe , `.${styleCodeName}`) ;
            }

        }) ;

        me.imports = imports ;

        me.code = code ;
    }

    toString(){

        return this.code ;
    }

} ;