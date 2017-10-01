const includeExpressionRe = /\{[^\{\}]+\}/,
      expressionRe = /^\{[^\{\}]+\}$/,
      eachExpressionRe = /\{([^\{\}]+)\}/g;

// 此表达式生成器为试验版，里面会有很多漏洞，仅用演示用

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