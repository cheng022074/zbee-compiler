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
    readTextFile
} = require('../fs'),
{
    env
} = process;

module.exports = name =>{

    let code = SourceCode.get(name) ;

    if(code && code.exists){

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
        name,
        motifyTime,
        folder,
        data
    } = code,
    path = APPLICATION.generateBinPath(folder , name);

    if(!env['ZBEE-ENV'] && motifyTime === getLastCompileTime(path)){

        return ;
    }

    let codeText ;

    if(folder === 'css'){

        codeText = data ;

    }else{

        codeText = `module.exports = ${format(data)}` ;
    }

    console.log(folder , codeText) ;

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

    return path.replace(/\.[^\.]+$/ , '') ;
}