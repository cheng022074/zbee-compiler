/**
 * 
 * 获取源代码的元类型
 * 
 * @param {string} 源代码文件全名
 * 
 * @return {string} 代码元类型
 * 
 */

const {
    SourceCode
} = require('../../../../src/code')

module.exports = name => {

    switch(SourceCode.getProperty(SourceCode.get(name) , 'metaName')){

        case 'code.meta.scss':

            return 'css' ;

        case 'code.meta.html':

            return 'html' ;

        case 'code.meta.script':

            return 'script' ;
    }

} ;