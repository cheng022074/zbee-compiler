const compile = require('../../../../compile/scss'),
{
    normalize,
    toImportCSSFileName,
    parse,
    toStylesheetCase
} = require('../../../../../src/name');

module.exports = class {

    constructor(meta , {
        scoped = false
    }){

        let me = this,
            styleCodeName = toStylesheetCase(meta.code.fullName),
            {
                imports,
                code
            } = compile(meta.rawBody , {
            getVariableName(name){

                return scoped ? `${styleCodeName}-${name}` : name;

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
            }
        }) ;

        me.imports = imports ;

        me.code = code ;
    }

    toString(){

        return this.code ;
    }

} ;