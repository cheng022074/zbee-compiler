const {
    sep,
    dirname,
    basename,
    join:path_join
} = require('path'),
{
    get:properties_get
} = require('./properties'),
{
    defined:is_defined
} = require('./is');

const dotRe = /\./g ;

exports.name2path = (name , suffix) =>{

    if(name === '*'){

        return '*' ;
    }

    return `${name.replace(dotRe , sep)}${suffix ? suffix : ''}` ;
}

const {
    readdirSync
} = require('fs'),
{
    file:is_file,
    directory:is_directory
} = require('./is');

exports.getFilePath = (path , suffixes) =>{

    let folderPath = dirname(path) ;

    if(is_directory(folderPath)){

        let name = basename(path),
            fileNames = readdirSync(folderPath),
            result = [];

        for(let fileName of fileNames){

            if(fileName.indexOf(name) === 0){

                if(suffixes && !suffixes.includes(exports.extname(fileName))){

                    continue ;
                }

                return path_join(folderPath , fileName) ; 
            }
        }
    }
}

const suffixRe = /(?:\.[^\.\/\\]+)+$/ ;

exports.getFilePaths = (path , suffixes) =>{

    let folderPath = dirname(path) ;

    if(is_directory(folderPath)){

        let name = basename(path),
            fileNames = readdirSync(folderPath),
            result = [],
            classNames = [];

        for(let fileName of fileNames){

            if(name === '*' || fileName.indexOf(name) === 0){

                let path = path_join(folderPath , fileName) ;

                if(is_file(path)){

                    if(suffixes && !suffixes.includes(exports.extname(fileName))){

                        continue ;
                    }

                    let className = exports.basename(path , folderPath) ;

                    if(!classNames.includes(className)){

                        classNames.push(className) ;

                        result.push(path) ; 
                    }
                }
            }
        }

        return result ;
    }

    return [] ;
}

exports.extname = path =>{

    let match = path.match(suffixRe) ;

    if(match){

        return match[0] ;
    }

    return '' ;
}

exports.basename = (path , folderPath) =>{

    if(is_defined(folderPath)){

        return path.replace(suffixRe , '').replace(folderPath , '').replace(/^[\\//]/ , '').replace(/[\/\\]/g , '.') ;
    }

    return basename(path) ;
}

exports.replaceSuffix = (path , suffix) =>{

    if(suffixRe.test(path)){

        return path.replace(suffixRe , suffix) ;
    }

    return `${path}${suffix}` ;
}

exports.getApplicationPath = path =>{

    return path_join(process.cwd() , path) ;
}

exports.getCompilerPath = path =>{

    return path_join(__dirname , '..' , path) ;
}

exports.COMPILE_SOURCE_PATH = exports.getApplicationPath(properties_get('compile.path.source')) ;

exports.COMPILE_DIST_PATH = exports.getApplicationPath(properties_get('compile.path.dist')) ;

exports.WEB_ROOT_PATH = exports.getApplicationPath(properties_get('web.path.root')) ;