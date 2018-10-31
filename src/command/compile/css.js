const {
    SourceCode,
    BinCode
} = require('../../code'),
{
    simpleObject:isObject
} = require('../../is'),
{
    APPLICATION
} = require('../../project'),
{
    join
} = require('path'),
{
    writeTextFile
} = require('../../fs'),
{
    toStylesheetCase
} = require('../../name'),
compile = require('../compile');


module.exports = name =>{

    if(compile(name)){

        let 
        code = SourceCode.get(name),
        {
            importAllNames
        } = code,
        result = [];

        for(let name of importAllNames){

            let {
                target
            } = BinCode.get(name) ;

            push(result , BinCode.get(name)) ;
        }

        let {
            fullName
        } = code ;

        push(result , BinCode.get(fullName)) ;

        let path = join(APPLICATION.getFolderPath('web') , `${toStylesheetCase(fullName)}.scss`) ;

        writeTextFile(path , result.join('\n')) ;

        console.log('已生成样式' , fullName) ;
    }
}

function push(result , {
    target
}){

    if(isObject(target) && target.type === 'scss' && target.hasOwnProperty('data')){

        result.push(target.data) ;
    }
}