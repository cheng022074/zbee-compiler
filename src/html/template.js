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

    if(cn){
        
        let len = cn.length ;

        for(let i = 0 ; i < len ; i ++){

            codes.push(...static(cn[i] ,  `${root}cn.${i}.`)) ;
        }
    }

    if(fields){

        let names = Object.keys(fields) ;

        for(let name of names){

            switch(name){

                case 'attrs.if':

                    codes.push(...[
                        `if(!!(${fields[name]}) === false){`,
                            `object_set(config , '${root}hidden' , true);`,
                        '}'
                    ]) ;

                    break ;

                case 'attrs.for':

                    break ;

                case 'attrs.each':

                    break ;

                default:

                    codes.push(`object_set(config , '${root}${name}' , ${fields[name]});`) ;
            }
        }
    }

    return codes ;
}