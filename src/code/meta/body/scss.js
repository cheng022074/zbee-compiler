const {
    parse
} = require('postcss'),
{
    defineProperties
} = require('../../../object');

module.exports = class {

    constructor(meta){

        let me = this,
        {
            rawBody:data
        } = meta;

        me.meta = meta ;

        me.data = parse(data) ;
        
        me.rawData = data ;

        defineProperties(me , [
            'params',
            'imports'
        ]) ;
    }

    toString(){

        return this.rawData ;
    }

} ;