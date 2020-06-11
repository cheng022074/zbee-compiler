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
SCSSCompile = require('./compile/scss'),
Updated = require('../../lib/file/updated');

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
        project,
        folder,
        name,
        path
    } = code;

    if(!env['ZBEE-ENV'] && !Updated.is(path)){

        return false;
    }

    Updated.reset(codePath) ;

    let {
        data,
        fullName
    } = code ;

    writeTextFile(project.generateBinPath(folder , name) , `module.exports = ${format(data)};`) ;

    console.log('已生成' , fullName) ;

    return true ;
}