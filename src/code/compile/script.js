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
} = require('path');

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
        libPaths = application.LIBRARY_PATHS,
        dirPath = dirname(path);

    for(let libPath of libPaths){

        console.log(relative(dirPath , libPath)) ;
    }

    writeTextFile(path , format(apply('code.compile.to.script' , {
        code:codeStr,
        defaultScope:application.DEFAULT_SCOPE
    }))) ;

    return path ;
}