const placeholderRe = /\$\{(.+)\}/ ;

function expression(expression){

    let match = expression.match(placeholderRe) ;

    if(match){

        let result = match[0] ;

        if(result === expression){

            return match[1] ;
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