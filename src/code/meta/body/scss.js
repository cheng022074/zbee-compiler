const {
    parse
} = require('postcss');

module.exports = class {

    constructor(meta){

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