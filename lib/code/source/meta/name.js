module.exports = function(){

    let me = this,
    {
        config
    } = me ;

    if(config){

        let {
            meta
        } = config,
        params = {};

        if(isObject(meta)){

            params = meta.params ;

            return meta.name ;
        }

        return name ;
    }
}