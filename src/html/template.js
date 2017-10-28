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

function static(tag){

    let {
        fields,
        cn
    } = tag ;

    if(fields){

        let names = Object.keys(fields) ;

        for(let name of names){

            switch(name){

                case 'attrs.if':

                    console.log('Hello O') ;
                 
                    break ;

                default:

                    
            }
        }
    }

    if(cn){

        let len = cn.length ;

        for(let i = 0 ; i < len ; i ++){

            codes.push(...static(cn[i] ,  `${currentKey}cn.${i}.`)) ;
        }
    }

    return codes ;
}