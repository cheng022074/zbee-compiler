const {
    SourceCode
} = require('../code'),
{
    APPLICATION
} = require('../project'),
{
    parse
} = require('../name'),
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

    if(!code.exists){

        return ;
    }

    let {
        target
    } = code ;

    if(!target){

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

    let codeText = format(target.binCodeText);

    if(target.hasOwnProperty('aliases')){

        let {
            aliases
        } = target ;

        for(let alias of aliases){

            writeTextFile(APPLICATION.generateBinPath('' , alias) , codeText) ;
        }
    }

    writeTextFile(path , format(code.target.binCodeText)) ;

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