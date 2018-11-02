const {
    defineCacheProperty
} = require('./object'),
{
    join,
    sep
} = require('path'),
{
    directory:is_directory
} = require('./is');

exports.initApplicationPath = path =>{

    exports.APPLICATION = path ;

    exports.initApplicationPath = () => {} ;
}

exports.applyCOMPILER = () =>{

    return join(__dirname , '..') ;
}

defineCacheProperty(exports , 'COMPILER') ;

const suffixRe = /(?:\.[^\.\/\\]+)+$/;

exports.extname = path =>{

    let match = path.match(suffixRe) ;

    if(match){

        return match[0] ;
    }

    return '' ;
}

const {
    dirname,
    basename,
    extname,
    normalize
} = require('path'),
{
    readdirSync
} = require('fs');

exports.fileNormalize = path =>{

    if(extname(path)){

        return normalize(path) ;
    }

    let dirPath = dirname(path),
        fileName = basename(path);

    if(is_directory(dirPath)){

        let names = readdirSync(dirPath) ;

        for(let name of names){

            if(fileName !== name && name.indexOf(`${fileName}.`) === 0){

                return join(dirPath , name) ;
            }
        }
    }

    return false ;
}

const pathSplitRe = /\/|\\/g ;

exports.toName = (filePath , rootPath) =>{

    rootPath = normalize(`${rootPath}${sep}`) ;

    filePath = filePath.replace(suffixRe , '') ;

    if(filePath.indexOf(rootPath) === 0){

        return filePath.replace(rootPath , '').replace(pathSplitRe , '.') ;
    }
}

const windowsPathSplitRe = /\\/g ;

exports.string = path =>{

    return path.replace(windowsPathSplitRe , '\\\\') ;
}