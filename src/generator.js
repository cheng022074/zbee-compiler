const 
{
    class:is_class
} = require('./is'),
{
    BinCode
} = require('./code'),
{
    Coder
} = require('./generator/coder');

module.exports = class {

    constructor(config){

        this.config = config ;
    }

    getCoder(el){

        let 
        me = this,
        {
            config
        } = me,
        {
            nodeName
        } = el ;

        if(config.hasOwnProperty(nodeName)){

            let CoderClass = BinCode.get(config[nodeName]).target ;

            if(is_class(CoderClass)){

                return new CoderClass(el , me) ;
            }
        }

        return Coder.empty ;
    }

    parse(doc){

        return this.getCoder(doc.documentElement) ;
    }
}