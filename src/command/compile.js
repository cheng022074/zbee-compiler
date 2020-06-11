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
} = require('../script'),
SCSSCompile = require('./compile/scss');

module.exports = name =>{

    let code = SourceCode.get(name) ;

    if(code && code.exists){

        let codes = new Map() ;

        codes.set(code , compile(code)) ;
        
        let {
            importAllSourceCodes
        } = code ;

        for(let code of importAllSourceCodes){

            codes.set(code , compile(code)) ;
        }

        let {
            metaName
        } = code;

        switch(metaName){

            case 'code.meta.scss':

                SCSSCompile(code , codes) ;
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

        return false;
    }


    let {
        motifyTime,
        project,
        folder,
        name
    } = code,
    path = project.generateBinPath(folder , name);

    if(!env['ZBEE-ENV'] && motifyTime === getLastCompileTime(path)){

        return false;
    }

    let {
        data,
        fullName
    } = code ;

    writeTextFile(path , `module.exports = ${format(data)};`) ;

    writeTextFile(getLastCompileTimePath(path) , motifyTime) ;

    console.log('已生成' , fullName) ;

    return true ;
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