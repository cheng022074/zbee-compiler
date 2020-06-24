const {
    apply
} = require('../template'),
{
    format
} = require('../script') ;

module.exports = (scriptMetas , config , name , metas) =>{

    let classes = {},
        names = Object.keys(scriptMetas),
        result = {};

    for(let name of names){

        let {
            standard,
            data
        } = scriptMetas[name] ;

        if(standard){

            classes[name] = data ;
        }
    }

    result['meta.json'] = JSON.stringify(metas , null , 2) ;

    result['index.js'] =  format(apply('code.package.bundle.lib' , classes));

    return result ;
}