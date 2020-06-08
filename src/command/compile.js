const {
    SourceCode
} = require('../code'),
{
    writeTextFile
} = require('../fs'),
{
    readTextFile
} = require('../fs'),
{
    env
} = process ;

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

        code.meta.afterCompile() ;

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
        motifyTime,
        meta
    } = code,
    {
        binPath:path
    } = meta;

    if(path === false || !env['ZBEE-ENV'] && motifyTime === getLastCompileTime(path)){

        return ;
    }

    writeTextFile(path , meta.binData) ;

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