#!/usr/bin/env node

const {
    file:isFile
} = require('../../src/is'),
{
    join,
    basename
} = require('path'),{
    getFilePaths,
    readFile,
    writeTextFile,
    readJSONFile,
    writeJSONFile,
    copyFile
} = require('../../src/fs'),
{
    assignIf
} = require('../../src/object'),
rootPath = process.cwd();

path = join(rootPath , 'properties.json');

if(!isFile(path)){

    copyFile(join(__dirname , '../../template/properties.json') , rootPath) ;
}

const JSZip = require('jszip'),
{
    keys
} = Object,
nodeModuleRootPath = join(rootPath , 'node_modules'),
packagePath = join(rootPath , 'package.json'),
packageData = readJSONFile(packagePath),
propertiesPath = join(rootPath , 'properties.json'),
propertiesData = readJSONFile(propertiesPath);

if(!packageData.hasOwnProperty('private')){

    packageData.private = true ;
}

if(!packageData.hasOwnProperty('version')){

    packageData.version = '0.0.0' ;
}

getFilePaths(join(rootPath , 'zbee_modules') , /\.zip$/).forEach(async (path) =>{

    let zip = new JSZip() ;

    zip = await zip.loadAsync(readFile(path)) ;

    let names = keys(zip.files),
        name = basename(path , '.zip');

    for(let fileName of names){

        let data = await zip.file(fileName).async('string');

        //writeTextFile(join(nodeModuleRootPath , name , fileName) , data) ;

        if(fileName === 'package.json'){

            let {
                dependencies = {},
                zbeeModule = false
            } = JSON.parse(data) ;

            packageData.dependencies = assignIf(packageData.dependencies , dependencies) ;

  
            if(zbeeModule){

                let {
                    libraries = []
                } = propertiesData ;

                if(!libraries.includes(name)){

                    libraries.push(name) ;
                }

                propertiesData.libraries = libraries ;

                writeJSONFile(propertiesPath , propertiesData) ;

                writeJSONFile(packagePath , packageData) ;
            }
        }
    }
}) ;