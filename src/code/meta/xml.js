const
Generator = require('../../script/generator'),
{
    get:config_get
} = require('../../config');

module.exports = class {

    constructor(code , coderConfigURI){

        let me = this ;

        me.data = load(code.path) ;

        defineCacheProperties(me , [
            'code',
            'importNames'
        ]) ;

        me.coder = new Generator(config_get(coderConfigURI)).parse(me.data) ;
    }

    applyCode(){

        return this.coder.code ;
    }

    applyImportNames(){

        return this.coder.imports ;
    }
}