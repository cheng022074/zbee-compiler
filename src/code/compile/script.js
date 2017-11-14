const {
    join
} = require('path'),
{
    writeTextFile
} = require('../../fs'),
{
    format
} = require('../../script'),
{
    apply
} = require('../../template'),
{
    relative,
    dirname
} = require('path'),
get_libraries = require('../script/libraries');

/**
 *
 * 将代码编译进 bin 目录，用以引导执行，并返回编译后路径
 *  
 * @param {String} codeStr 代码文本
 * 
 * @param {SourceCode} code 代码对象
 * 
 * @return {String} 编译后的路径
 * 
 */

module.exports = (codeStr , code) =>{

    let application = code.project,
        path = join(application.BIN_PATH , code.scope , `${code.name}.js`),
        libPaths = application.NODE_LIBRARY_PATHS,
        dirPath = dirname(path),
        libraries = [];

    for(let libPath of libPaths){

        libraries.push(relative(dirPath , libPath)) ;
    }

    libraries = get_libraries(libraries) ;

    writeTextFile(path , format(apply('code.compile.to.script' , {
        code:codeStr,
        defaultScope:application.DEFAULT_SCOPE,
        libraries
    }))) ;

    return path ;
}