const {
    SourceCode
} = require('../code'),
{
    APPLICATION
} = require('../project'),
{
    writeTextFile
} = require('../fs'),
{
    format
} = require('../script'),
{
    getMotifyTime,
    readTextFile
} = require('../fs'),
{
    env
} = process;

module.exports = name =>{

    let code = SourceCode.get(name) ;

    if(code){

        compile(code) ;

        let {
            importAllSourceCodes
        } = code ;

        for(let code of importAllSourceCodes){

            compile(code) ;
        }

        return true ;
    
    }

    return false ;
}

function compile(code){

    let {
        exists
    } = code ;

    if(!exists){

        return ;
    }


    let {
        name
    } = code,
    path = APPLICATION.generateBinPath(code.folder , name),
    motifyTime = getMotifyTime(code.path);

    if(!env['ZBEE-ENV'] && motifyTime === getLastCompileTime(path)){

        return ;
    }

    let codeText = format(code.binCodeText) ;

    writeTextFile(path , codeText) ;

    writeTextFile(getLastCompileTimePath(path) , motifyTime) ;

    console.log('已生成' , code.fullName) ;
}

function getLastCompileTime(path){

    let time = readTextFile(getLastCompileTimePath(path)) ;

    if(time){

        return Number(time) ;
    }

    return -1 ;
}

function getLastCompileTimePath(path){

    return path.replace(/\.js$/ , '') ;
}