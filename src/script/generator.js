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

        if(paramEl.hasAttribute('value')){

            params.push(expression(paramEl.getAttribute('value'))) ;
        
        }else{

            let {
                childNodes
            } = paramEl,
            isFinded = false;

            childNodes = Array.from(childNodes) ;

            for(let childNode of childNodes){

                if(childNode.nodeType === 4){

                    params.push(childNode.nodeValue) ;

                    isFinded = true ;

                    break ;
                }
            }

            if(!isFinded){

                params.push(paramEl.nodeValue) ;
            }
        }
    }

    return params.join(',') ;
}