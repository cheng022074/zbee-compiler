const {
    SourceCode
} = require('../code'),
{
    readTextFile,
    writeTextFile
} = require('../fs'),
{
    apply
} = require('../template'),
{
    format,
    min
} = require('../script'),
{
    get
} = require('../config'),
{
    APPLICATION
} = require('../project'),
{
    join
} = require('path'),
{
    unique
} = require('../array');

module.exports = (name = 'default') =>{

    let config = get('package' , name) ;

    if(!config){

        return ;
    }

    let {
        classes:names,
        name:fileName,
        compress,
        targets,
        independent
    } = config,
    codes = [];

    if(!fileName){

        fileName = name ;
    }
    
    for(let name of names){

        let code = SourceCode.get(name) ;

        if(code.exists){

            let {
                importAllSourceCodes
            } = code ;
    
            for(let code of importAllSourceCodes){

                if(code.exists){

                    codes.push(code) ;
                }
            }

            codes.push(code) ;
        }
    }

    codes = unique(codes) ;

    let libraries = [] ;

    if(independent){

        let paths = APPLICATION.libraries.paths;

        for(let path of paths){

            libraries.push(readTextFile(path));

        }
    }

    let path = join(APPLICATION.getFolderPath('package') , `${fileName}.js`),
        data = apply('code.package' , {
            codes,
            independent,
            libraries,
            defaultFolder:APPLICATION.defaultFolder
        });

    if(compress){

        data = min(data) ;
    
    }else{

        data = format(data) ;
    }    

    writeTextFile(path , data) ;

    console.log('已打包' , path) ;

    targets = targets || [] ;

    let rootPath = join(APPLICATION.rootPath , '..') ;

    for(let target of targets){

        let path = join(rootPath , target) ;

        writeTextFile(path , data) ;

        console.log('已打包' , path) ;
    }
}