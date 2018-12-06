const 
Meta = require('../meta')(),
textCodeMetaRe = /\/\*(?:.|[^.])+?\*\//,
{
    readTextFile
} = require('../../fs'),
{
    defineProperty
} = require('../../object');

module.exports = class extends Meta{

    constructor(code){

        super(code) ;

        let me = this ;

        me.data = readTextFile(code.path) ;

        defineProperty(me , 'header') ;
    }

    getHeader(){

        let {
            data
        } = this,
        result = data.match(textCodeMetaRe);

        if(result){

            return result[0] ;
        }

        return '' ;
    }

    getBody(){

        let {
            data
        } = this ;
        
        return data.replace(textCodeMetaRe , '') ;
    }
}