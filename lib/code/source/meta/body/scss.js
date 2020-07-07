const compile = require('../../compile/scss'),
{
    normalize
} = require('../../../../../src/name'),
parse = require('../../../../name/parse'),
toStylesheetName = require('../../../../name/stylesheet'),
toImportStylesheetName = require('../../../../name/stylesheet/import'),
getFullName = require('../../../../name/full'),
mainRe = /^\.\-main\-/;

module.exports = class {

    constructor(meta , {
        scoped = false
    }){

        let me = this,
            {
                fullName
            } = meta.code,
            styleCodeName = toStylesheetName(fullName),
            styleCodeNameWithPrefix = toStylesheetName(fullName , true),
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
            getImportFilePath(name){

                return toImportStylesheetName(getFullName(name , 'css')) ;
            },
            getRootSelector(){

                return scoped ? `.${styleCodeNameWithPrefix}` : false;
            },

            getExtendSelector(fullName){

                return `.${toStylesheetName(getFullName(fullName , 'css') , true)}` ;
            },

            replaceSelector(name){

                return name.replace(mainRe , `.${styleCodeNameWithPrefix}-`) ;
            }

        }) ;

        me.imports = imports ;

        me.code = code ;
    }

    toString(){

        return this.code ;
    }

} ;