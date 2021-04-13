const compile = require('../../compile/scss'),
{
    normalize
} = require('../../../../../src/name'),
toStylesheetName = require('../../../../name/stylesheet'),
toImportStylesheetName = require('../../../../name/stylesheet/import'),
getFullName = require('../../../../name/full'),
parse = require('../../../../name/parse'),
mainRe = /^\.\-main\-/;

module.exports = class {

    constructor(meta , {
        scoped = false
    }){

        let me = this,
            {
                fullName
            } = meta.code,
            time = Date.now(),
            styleCodeName = toStylesheetName(fullName),
            styleCodeNameWithPrefix = toStylesheetName(fullName , `--${time}--`),
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

                if(scoped){

                    if(styleCodeNameWithPrefix === styleCodeName){

                        return `.${styleCodeNameWithPrefix}` ;
                    }

                    return `.${styleCodeNameWithPrefix},.${styleCodeName}`
                }

                return false ;
            },

            getExtendSelector(fullName){

                return `.${toStylesheetName(getFullName(fullName , 'css'))}` ;
            },

            replaceSelector(name){

                return name.replace(mainRe , `.${styleCodeNameWithPrefix}-`) ;
            }

        }) ;

        me.imports = imports ;

        me.code = code.replace(new RegExp(`\\-{2}${time}\\-{2}` , 'g') , '${prefix}') ;
    }

    toString(){

        return this.code ;
    }

} ;