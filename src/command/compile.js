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
} = process,
{
    format
} = require('../script');

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
        motifyTime,
        project,
        folder,
        name
    } = code,
    path = project.generateBinPath(folder , name);

    if(!env['ZBEE-ENV'] && motifyTime === getLastCompileTime(path)){

        return ;
    }

    let {
        data,
        fullName
    } = code ;

    writeTextFile(path , `module.exports = ${format(data)};`) ;

    writeTextFile(getLastCompileTimePath(path) , motifyTime) ;

    console.log('已生成' , fullName) ;
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