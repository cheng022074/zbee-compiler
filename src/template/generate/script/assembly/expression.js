const includeExpressionRe = /\{[^\{\}]+\}/,
      expressionRe = /^\{[^\{\}]+\}$/,
      eachExpressionRe = /\{([^\{\}]+)\}/g,
      {
        toLiteral
      } = require('../../../../string');

// 此表达式生成器为试验版，里面会有很多漏洞，仅用演示用

// 有关于 if choose-case 的 test 表达式

// 有关于在赋值表达式中直接引用以花括号的方式

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

        return toLiteral(expression) ;

    }

    return '' ;
}