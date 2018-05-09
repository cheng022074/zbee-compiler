const
Generator = require('../../generator'),
{
    get:config_get
} = require('../../config'),
{
    load
} = require('../../xml'),
{
    defineCacheProperties
} = require('../../object'),
{
    split
} = require('../../string');

module.exports = class {

    constructor(code , coderConfigURI){

        let me = this ;

        me.data = load(code.path) ;

        defineCacheProperties(me , [
            'code',
            'importNames',
            'generates',
            'aliases'
        ]) ;

        me.coder = new Generator(config_get(coderConfigURI)).parse(me.data) ;
    }

    applyAliases(){

        let {
            documentElement:el
        } = this.data ;

        if(el.hasAttribute('alias')){

            return split(el.getAttribute('alias') , /\s+/) ;
        }

        return [] ;
    }

    applyCode(){

        return this.coder.code ;
    }

    applyImportNames(){

        return this.coder.imports ;
    }

    applyGenerates(){

        return this.coder.generates ;
    }
}