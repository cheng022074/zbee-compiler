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
} = process,
{
    renderSync
} = require('node-sass'),
{
    basename,
    dirname,
    join
} = require('path'),
{
    toBinCSSFileName
} = require('../name');

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

        {
            let {
                folder,
                name
            } = code ;
    
            if(folder === 'css'){

                writeTextFile(join(APPLICATION.getFolderPath('bin') , folder , toBinCSSFileName(name)) , renderSync({
                    file:APPLICATION.generateBinPath(folder , name)
                }).css.toString('utf8')) ;

            }
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