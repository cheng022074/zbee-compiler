const placeholderBorderRe = /(?:^\$\{)|(?:\}$)/g,
{
    match
} = require('../regexp');

function expression(expression){

    let result = match(expression , /(?:\$\{)|\{|\}/g , [{
        start:'${',
        end:'}'
    },{
        start:'{',
        end:'}'
    }]) ;

    if(result){

        result = result[0] ;

        if(result === expression){

            return result.replace(placeholderBorderRe , '') ;
        }

        return `\`${expression}\`` ;
    }

    return `'${expression}'` ;
}

exports.expression = expression ;

exports.params = paramEls =>{

    let params = [] ;

    for(let paramEl of paramEls){

        params.push(expression(paramEl.getAttribute('value'))) ;
    }

    return params.join(',') ;
}