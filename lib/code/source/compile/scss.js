const {
    parse,
    rule:createRule
} = postcss = require('postcss') ;

/**
 * 
 * @param {string}  data SCSS 样式文本
 * 
 * @param {object} options 选项配置
 * 
 * @param {function} [options.getVariableName] 获得编译后的变量名称
 * 
 * @param {function} [options.getImportFilePath] 获得导入的资源路径
 * 
 * @param {function} [options.getImportItem] 获得导入项配置
 * 
 */

 const variablePrefixRe = /^\$/,
       doubleQuoteRe = /\"([^\"]+)\"/,
       defaultValueRe = /\!default$/,
       selectorRe = /\.[^\.\,]+/g;

const {
    keys
} = Object ;

module.exports = (data , {
    getVariableName,
    getImportItem,
    getImportFilePath,
    getRootSelector,
    replaceSelector
}) => {

    let {
        expressions,
        data:processData
    } = before_compile(data),
    variables = {};

    let root = parse(before_compile(processData).data).root(),
        imports = [];

    root.walk(node => {

        let {
            selector,
            type,
            name,
            params,
            prop,
            value
        } = node ;

        switch(type){

            case 'atrule':

                if(name === 'import'){

                    let [
                        ,
                        fullName
                    ] = params.match(doubleQuoteRe) ;
                
                    imports.push(getImportItem(fullName)) ;
                    
                    let path = getImportFilePath(fullName) ;

                    if(path === false){

                        root.removeChild(node) ;
                    
                    }else{

                        node.params = `"${path}"` ;
                    }
                }

                break ;

            case 'decl':

                if(variablePrefixRe.test(prop)){

                    let variable = getVariableName(prop.replace(variablePrefixRe , '')) ;

                    if(variable !== prop){

                        variables[prop] = node.prop = `$${variable}` ;
                    }

                    if(!defaultValueRe.test(value)){

                        node.value = `${value} !default` ;
                    }
                }

                break ;

            case 'rule':

                let rootSelector = getRootSelector() ;

                if(rootSelector){

                    let rule = createRule({
                        selector:rootSelector
                    }) ;
    
                    root.insertBefore(node , rule) ;
    
                    root.removeChild(node) ;
    
                    rule.append(node) ;
                }

                if(replaceSelector){

                    node.selector = selector.replace(selectorRe , replaceSelector) ;
                }
        }
    }) ;

    return {
        imports,
        code:after_compile(root.toString() , expressions , variables)
    } ;
}


function before_compile(data){

    let expressions = {},
        count = 1,
        prefix = `expression-${Date.now()}-`;

    return {
        expressions,
        data:data.replace(/#\{[^\{\}]+\}/g , expression => {

            let replaceExpression = `${prefix}${count ++}` ;

            expressions[replaceExpression] = expression ;

            return replaceExpression ;

        })
    }
}

function after_compile(data , expressions , variables){

    {
        let names = keys(expressions) ;

        for(let name of names){

            console.log(name , expressions[name])

            data = data.replace(name , expressions[name]) ;
        }
    }

    {
        let names = keys(variables) ;
        
        for(let name of names){

            data = data.replace(name , variables[name]) ;
        }
    }

    return data ;
}