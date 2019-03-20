const {
    APPLICATION
} = require('../project'),
{
    join,
    basename
} = require('path'),
{
    getFilePaths,
    readFile,
    writeTextFile
} = require('../fs'),
{
    file:isFile
} = require('../is'),
JSZip = require('jszip'),
{
    keys
} = Object;

async function install(name){

    let {
        rootPath
    } = APPLICATION,
    zbeeModuleRootPath = join(rootPath , 'zbee_modules'),
    nodeModuleRootPath = join(rootPath , 'node_modules');

    if(name){

        let path = join(zbeeModuleRootPath , `${name}.zip`) ;

        if(isFile(path)){

            let zip = new JSZip() ;

            zip = await zip.loadAsync(readFile(path)) ;

            let names = keys(zip.files) ;

            for(let fileName of names){

                let data = await zip.file(fileName).async('string') ;

                writeTextFile(join(nodeModuleRootPath , name , fileName) , data) ;

                if(fileName === 'package.json'){

                    let {
                        dependencies = {}
                    } = JSON.parse(data) ;

                    APPLICATION.addDependencies(dependencies) ;
                }
            }

            APPLICATION.savePackage() ;

            console.log('已安装' , name) ;
        
        }else{

            console.log('不存在' , name) ;
        }

    }else{

        let paths = getFilePaths(join(rootPath , 'zbee_modules') , /\.zip$/) ;

        for(let path of paths){

            await install(basename(path , '.zip')) ;

        }

       
    }
}

module.exports = install ;