const {
    defineCacheProperties
} = require('../object'),
{
    apply
} = require('../template');

module.exports = class {

    constructor(sourceCode , MetaClass , binTemplate , packageTemplate){

        let me = this ;

        me.sourceCode = sourceCode,
        me.MetaClass = MetaClass,
        me.binTemplate = binTemplate,
        me.packageTemplate = packageTemplate;

        defineCacheProperties(me , [
            'meta',
            'binCodeText',
            'packageCodeText'
        ]) ;
    }

    applyMeta(){

        let {
            MetaClass,
            sourceCode
        } = this ;

        return new MetaClass(sourceCode) ;
    }

    applyBinCodeText(){

        let {
            binTemplate,
            sourceCode:code,
            meta
        } = this;

        return apply(binTemplate , {
            code,
            meta
        }) ;
    }
}