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
    }

    return names;
}

function compile(codeName){

    let path = getSourceCodePath(codeName) ;

    if(!path){

        return;
    }

    if(!env['ZBEE-ENV'] && !Updated.is(path) && !env['ZBEE-PARAM-FORCE']){

        return;
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

    let {
        importNames
    } = Meta.get(codeName) ;

    for(let importName of importNames){

        compile(importName) ;
    }
}