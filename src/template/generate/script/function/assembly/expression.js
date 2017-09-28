const includeExpressionRe = /\{[^\{\}]+\}/,
      expressionRe = /^\{[^\{\}]+\}$/,
      eachExpressionRe = /\{([^\{\}]+)\}/g;

module.exports = expression =>{

    if(expressionRe.test(expression)){
        
        return expression.replace(eachExpressionRe , (match , expression) =>{

            return expression ;

        }) ;

    }else if(includeExpressionRe.test(expression)){

        return `\`${expression.replace(eachExpressionRe , (match , expression) =>{

            return `$\{${expression}\}` ;

        })}\`` ;

    }else{

        return `'${expression}'` ;

    }

    return '' ;
}