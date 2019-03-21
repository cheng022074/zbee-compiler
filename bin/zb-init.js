#!/usr/bin/env node

{
    const {
        file:isFile
    } = require('../src/is'),
    {
        join
    } = require('path'),{
        writeTextFile,
        readTextFile
    } = require('../src/fs'),
    path = join(process.cwd() , 'properties.json');

    if(!isFile(path)){

        writeTextFile(path , readTextFile(join(__dirname , '../template/properties.json'))) ;
    }
}

(async () =>{

    const {
        getFilePaths,
        readFile,
        writeTextFile,
        readJSONFile,
        writeJSONFile
    } = require('../src/fs'),
    {
        assignIf
    } = require('../src/object'),
    {
        join,
        basename
    } = require('path'),
    JSZip = require('jszip'),
    {
        keys
    } = Object,
    rootPath = process.cwd(),
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

    let paths = getFilePaths(join(rootPath , 'zbee_modules') , /\.zip$/) ;

    for(let path of paths){

        let zip = new JSZip() ;

        zip = await zip.loadAsync(readFile(path)) ;

        let names = keys(zip.files),
            name = basename(path , '.zip');

        for(let fileName of names){

            let data = await zip.file(fileName).async('string');

            writeTextFile(join(nodeModuleRootPath , name , fileName) , data) ;

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
                }
            }
        }
    }

    writeJSONFile(packagePath , packageData) ;

})().then(() =>{

  console.log('成功' , '已初始化') ;  

}) ;