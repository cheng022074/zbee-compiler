const {
    parse,
    rule:createRule
} = require('postcss') ;

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
       defaultValueRe = /\!default$/;

module.exports = (data , {
    getVariableName,
    getImportItem,
    getImportFilePath,
    getRootSelector
}) => {

    let root = parse(data).root(),
        imports = [];

    root.each(node => {

        let {
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

                node.prop = `$${getVariableName(prop.replace(variablePrefixRe , ''))}` ;

                if(!defaultValueRe.test(value)){

                    node.value = `${value} !default` ;
                }

                break ;

            case 'rule':

                let rootSelector = getRootSelector(name) ;

                if(rootSelector){

                    let rule = createRule({
                        selector:rootSelector
                    }) ;
    
                    root.insertBefore(node , rule) ;
    
                    root.removeChild(node) ;
    
                    rule.append(node) ;
                }
        }
    }) ;

    return {
        imports,
        code:root.toString()
    } ;
}