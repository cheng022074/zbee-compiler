const { BinCode } = require('../code');

const {
    writeTextFile
} = require('../fs'),
{
    APPLICATION
} = require('../project'),
{
    runAsync
} = require('../runner'),
{
    env
} = process,
{
    format
} = require('../script'),
{
    parse
} = require('../name'),
Updated = require('../../lib/file/updated'),
Meta = require('../../lib/code/bin/meta'),
getSourceCodeNames = require('../../lib/code/source/names'),
getSourceCodePath = require('../../lib/code/source/path'),
getFullName = require('../../lib/code/source/name/full');

module.exports = name =>{

    let names = getSourceCodeNames(getFullName(name)),
        compiledNames = [];

    for(let name of names){

        compile(name , compiledNames) ;
    }

    return names;
}

function compile(codeName , compiledNames){

    if(compiledNames.includes(codeName)){

        return ;
    }

    compiledNames.push(codeName) ;

    let path = getSourceCodePath(codeName),
        {
            folder,
            name
        } = parse(codeName , 'src'),
        binPath = APPLICATION.generateBinPath(folder , name);

    if(path){

        if(!env['ZBEE-ENV'] && !Updated.is(path) && !env['ZBEE-PARAM-FORCE']){

            compileImports(codeName , compiledNames) ;

            return;
        }
    
        Updated.reset(path) ;
    
        Meta.save(codeName) ;
    
    }else if(!Meta.has(codeName)){

        return ;
    }

    let {
        data
    } = Meta.get(codeName);

    writeTextFile(binPath , `module.exports = ${format(data)};`) ;

    switch(Meta.getMetaType(codeName)){

        case 'css':

            writeTextFile(APPLICATION.generateBinPath(folder , name , '.scss') , runAsync(BinCode.get(codeName).target)) ;
    }
    
    console.log('已生成' , codeName) ;

    compileImports(codeName , compiledNames) ;
    
}

function compileImports(codeName , compiledNames){

    let {
        importNames
    } = Meta.get(codeName) ;

    for(let importName of importNames){

        compile(importName , compiledNames) ;
    }
}