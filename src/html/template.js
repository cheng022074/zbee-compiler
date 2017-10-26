const {
    parse
} = require('./structure'),
{
    apply
} = require('../template');

exports.compile = template =>{

    let config = parse(template);

    console.log(apply('html.template.compile' , {
        config,
        code:compile(config).join('\n')
    })) ;
}

function compile(tag , root = '.'){

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

            codes.push(...compile(cn[i] ,  `${root}cn.${i}.`)) ;
        }
    }

    return codes ;
}