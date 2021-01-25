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
getFullName = require('../../lib/name/full'),
{
    libraryUpdateTime
} = Meta;

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

            execute(codeName , folder , name) ;

            return;
        }
    
        Updated.reset(path) ;
    
        Meta.save(codeName) ;
    
    }else{

        Meta.remove(codeName) ;

        if(Meta.has(codeName)){

            Updated.reset(binPath) ;

            if(Updated.get(binPath) > libraryUpdateTime){

                execute(codeName , folder , name) ;

                return ;
            }

        }else{

            execute(codeName , folder , name) ;
            
            return ;
        }
    }

    let {
        data
    } = Meta.get(codeName);

    writeTextFile(binPath , `module.exports = ${format(data)};`) ;

    execute(codeName , folder , name) ;
    
    console.log('已生成' , codeName) ;

    compileImports(codeName , compiledNames) ;
    
}

function execute(codeName , folder , name){

    switch(Meta.getMetaType(codeName)){

        case 'css':

            writeTextFile(APPLICATION.generateBinPath(folder , name , '.scss') , runAsync(BinCode.get(codeName).target , process.env[`ZBEE-PARAM-${folder}-PREFIX`])) ;
    }
}

function compileImports(codeName , compiledNames){

    let {
        importNames
    } = Meta.get(codeName) ;

    for(let importName of importNames){

        compile(importName , compiledNames) ;
    }
}