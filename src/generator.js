const 
{
    class:is_class
} = require('./is'),
{
    BinCode
} = require('./code'),
{
    Coder
} = require('./generator/coder'),
{
    get:config_get
} = require('./config');

module.exports = class {

    constructor(uri){

        this.uri = uri ;
    }

    getCoder(el){

        let 
        me = this,
        {
            uri
        } = me,
        {
            nodeName
        } = el,
        className = config_get(uri , nodeName);

        if(className){

            let CoderClass = BinCode.get(className).target ;

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