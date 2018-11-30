const {
    defineCacheProperties
} = require('../../../object'),
{
    load
} = require('../../../json'),
{
    push
} = require('../../../array');

module.exports = class {

    constructor(code){

        let me = this ;
        
        me.data = load(cod.path) ;

        defineCacheProperties(data , [
            'importNames',
            'code'
        ]) ;
    }

    applyImportNames(){

        let {
            imports,
            proxy
        } = this.data,
        result = [
            'data.model'
        ]; 

        push(result , imports) ;


    }

    applyCode(){

        return '' ;
    }
}