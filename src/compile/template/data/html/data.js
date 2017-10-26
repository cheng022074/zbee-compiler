const {
    parseSourceCodeName,
    BIN_PATH,
    executeBinCode
} = require('../../../../application'),
{
    readHTMLFile,
    writeTextFile
} = require('../../../../fs'),
{
    static
} = require('../../../../html/template'),
{
    stringify
} = require('../../../../html/structure'),
{
    join
} = require('path') ;

module.exports = (data , {
    scope,
    name
}) =>{

    let codeName = `${scope}::${name}`,
        config = parseSourceCodeName(`${scope}::${name}` , '.html') ;

    if(config){

        writeTextFile(join(BIN_PATH , scope , `${name}.js`) , static(readHTMLFile(config.path))) ;

        return {
            code:stringify(executeBinCode(codeName , data))
        }
    }

    return {
        code:''
    } ;
}