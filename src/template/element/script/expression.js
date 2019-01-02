const placeholderBorderRe = /(?:^\$\{)|(?:\}$)/g,
{
    match
} = require('../../../regexp');

module.exports = expression =>{

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