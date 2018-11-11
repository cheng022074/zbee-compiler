const 
{
    BinCode
} = require('../../code'),
{
    APPLICATION
} = require('../../project'),
{
    toStylesheetCase
} = require('../../name'),
{
    writeTextFile
} = require('../../fs'),
{
    join
} = require('path'),
{
    apply
} = require('../../template'),
package = require('../package') ;

module.exports = ({
    fullName,
    target
}) =>{

    let webPath = APPLICATION.getFolderPath('web'),
        data = BinCode.get(fullName).target.data;

    fullName = toStylesheetCase(fullName) ;

    let htmlPath = join(webPath , `${fullName}.html`) ;

    writeTextFile(htmlPath , data) ;

    console.log('已生成' , htmlPath) ;

    let scriptPackagePath = join(webPath , fullName ,  'package.js') ;

    writeTextFile(scriptPackagePath , packageScriptData(target.meta)) ;

    console.log('已生成' , scriptPackagePath) ;

    let cssPackagePath = join(webPath , fullName , 'package.scss') ;

    writeTextFile(cssPackagePath , packageCSSData(target.meta)) ;

    console.log('已生成' , cssPackagePath) ;

    let scriptPath = join(webPath , `${fullName}.js`) ;

    writeTextFile(scriptPath , apply('webpack.script' , fullName)) ;

    console.log('已生成' , scriptPath) ;

    return {
        webPath,
        scriptPath,
        htmlPath
    } ;
}

const {
    values
} = Object ;

function packageCSSData({
    importCSSNames
}){

    return values(package({
        classes:importCSSNames,
        type:'css',
        memory:true
    }))[0] ;
}

function packageScriptData({
    importScriptNames
}){

    return values(package({
        classes:importScriptNames,
        type:'browser',
        memory:true
    }))[0] ;
}