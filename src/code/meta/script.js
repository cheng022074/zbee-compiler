const 
Meta = require('../meta')(),
textCodeMetaRe = /\/\*(?:.|[^.])+?\*\//,
{
    readTextFile
} = require('../../fs');

module.exports = class extends Meta{

    applyBody(){

        let {
            code
        } = this,
        result = readTextFile(code.path).match(textCodeMetaRe) ;

        if(result){

            return result[0] ;
        }

        return super.applyBody() ;
    }
}