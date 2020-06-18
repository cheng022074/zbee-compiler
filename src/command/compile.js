const {
    writeTextFile
} = require('../fs'),
{
    APPLICATION
} = require('../project'),
{
    env
} = process,
{
    format
} = require('../script'),
Updated = require('../../lib/file/updated'),
Meta = require('../../lib/code/bin/meta'),
getSourceCodeNames = require('../../lib/code/source/names'),
getSourceCodePath = require('../../lib/code/source/path'),
getFullName = require('../../lib/code/source/name/full');

module.exports = name =>{

    let names = getSourceCodeNames(getFullName(name)) ;

    for(let name of names){

        compile(name) ;

        let importNames = Meta.getImportAllNames(name) ;

        for(let importName of importNames){

            compile(importName) ;
        }
    }

    return !!names.length;
}

function compile(codeName){

    let path = getSourceCodePath(codeName) ;

    if(!path){

        return false ;
    }

    if(!env['ZBEE-ENV'] && !Updated.is(path) && !env['ZBEE-PARAM-FORCE']){

        return false;
    }

    Updated.reset(path) ;

    Meta.save(codeName) ;
    
    let {
        data,
        folder,
        name,
        fullName
    } = Meta.get(codeName);

    writeTextFile(APPLICATION.generateBinPath(folder , name) , `module.exports = ${format(data)};`) ;

    console.log('已生成' , fullName) ;

    return true ;
}