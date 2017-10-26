const {
    parse
} = require('./structure'),
{
    apply
} = require('../template');

exports.static = template =>{

    let config = parse(template);

    return apply('html.template.compile' , {
        config,
        code:static(config).join('\n')
    }) ;
}

function static(tag , root = ''){

    let {
        fields,
        cn
    } = tag,
    codes = [];

    if(fields){

        let names = Object.keys(fields) ;

        for(let name of names){

            codes.push(`object_set(config , '${root}${name}' , ${fields[name]});`) ;
        }
    }

    if(cn){

        let len = cn.length ;

        for(let i = 0 ; i < len ; i ++){

            codes.push(...static(cn[i] ,  `${root}cn.${i}.`)) ;
        }
    }

    return codes ;
}