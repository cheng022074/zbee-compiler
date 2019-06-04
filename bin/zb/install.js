#!/usr/bin/env node

const {
    join,
    basename
} = require('path'),{
    getFilePaths,
    readFile,
    writeTextFile
} = require('../../src/fs'),
rootPath = process.cwd();

const JSZip = require('jszip'),
{
    keys
} = Object,
nodeModuleRootPath = join(rootPath , 'node_modules');

getFilePaths(join(rootPath , 'zbee_modules') , /\.zip$/).forEach(async (path) =>{

    let zip = new JSZip() ;

    zip = await zip.loadAsync(readFile(path)) ;

    let names = keys(zip.files),
        name = basename(path , '.zip');

    for(let fileName of names){

        writeTextFile(join(nodeModuleRootPath , name , fileName) , await zip.file(fileName).async('string')) ;

    }
}) ;