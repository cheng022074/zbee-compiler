const {
    runAsync:run
} = require('../../../src/runner'),
{
    simpleObject:isObject
} = require('../../../src/is');
module.exports = function(){

    let me = this,
        {
            config
        } = me ;

    if(config){

        let {
            meta = 'code.meta'
        } = config,
        params = {};

        if(isObject(meta)){

            params = meta.params ;

            meta = meta.name ;
        }

        return run(BinCode.get(meta).target , me , params) ;
    }
}