const {
    apply
} = require('../template'),
{
    format
} = require('../script') ;

module.exports = metas =>{

    let classes = {},
        names = Object.keys(metas),
        result = {};

    for(let name of names){

        let {
            standard,
            data
        } = metas[name] ;

        if(standard){

            classes[name] = data ;
        }
    }

    result['meta.json'] = JSON.stringify(metas , null , 2) ;

    result['index.js'] =  format(apply('code.package.bundle.lib' , classes));

    return result ;
}