const placeholderBorderRe = /(?:^\$\{)|(?:\}$)/g,
{
    range
} = require('../regexp');

function expression(expression){

    let result = range(expression , /(?:\$\{)|\{|\}/g , [{
        start:'${',
        end:'}'
    },{
        start:'{',
        end:'}'
    }]) ;

    if(result){

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