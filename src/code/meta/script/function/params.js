const {
    from
} = require('../../../../array') ;

module.exports = params =>{

    params = from(params) ;

    let result = [] ;

    for(let param of params){

        result.push({
            name:param,
            items:[],
            types:[
                'mixed'
            ]
        }) ;
    }

    return result ;
}