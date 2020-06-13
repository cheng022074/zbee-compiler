const {
    SourceCode
} = require('../code'),
{
    writeTextFile
} = require('../fs'),
{
    env
} = process,
{
    format
} = require('../script'),
SCSSCompile = require('../compile/scss'),
Updated = require('../../lib/file/updated'),
Meta = require('../../lib/code/bin/meta');

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

    if(!env['ZBEE-ENV'] && !Updated.is(path) && !env['ZBEE-PARAM-FORCE']){

        return false;
    }

    Updated.reset(path) ;

    let {
        data,
        fullName
    } = code;

    Meta.save(fullName) ;

    writeTextFile(project.generateBinPath(folder , name) , `module.exports = ${format(data)};`) ;

    console.log('已生成' , fullName) ;

    return true ;
}