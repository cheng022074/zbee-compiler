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
            'binCodeData',
            'binCodeText',
            'packageCodeData',
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

    applyBinCodeData(){

        let {
            sourceCode:code,
            meta
        } = this;

        return {
            code,
            meta
        } ;
    }

    applyBinCodeText(){

        let me = this,
        {
            binTemplate
        } = me;

        return apply(binTemplate , me.binCodeData) ;
    }
}