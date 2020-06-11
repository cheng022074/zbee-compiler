const {
    parse
} = require('postcss') ;

/**
 * 
 * @param {string}  data SCSS 样式文本
 * 
 * @param {object} options 选项配置
 * 
 * @param {function} [options.getVariableName] 获得编译后的变量名称
 * 
 * @param {function} [options.getImportName] 获得导入的资源名称
 */

 const variablePrefixRe = /^\$/,
       doubleQuoteRe = /\"([^\"]+)\"/;

module.exports = (data , {
    getVariableName,
    getImportInfo,
    getImportFilePath
}) => {

    let root = parse(data).root();

    root.each(node => {

        let {
            type,
            name,
            params
        } = node ;

        switch(type){

            case 'atrule':

                if(name === 'import'){

                    let [
                        ,
                        fullName
                    ] = params.match(doubleQuoteRe) ;
                
                    imports.push(getImportInfo(fullName)) ;
                    
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
        }
    }) ;

    return root.toString() ;
}