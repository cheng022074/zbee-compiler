const {
    sep,
    dirname,
    basename,
    join:path_join
} = require('path'),
{
    defined:is_defined,
    directory:is_directory,
    string:is_string,
    boolean:is_boolean
} = require('./is'),
suffixRe = /(?:\.[^\.\/\\]+)+$/;

exports.basename = (path , suffix) =>{

    let name = basename(path) ;

    if(is_string(suffix)){

        if(suffixRe.test(path)){

            return name.replace(suffixRe , suffix) ;
        }

        return `${name}${suffix}` ;
    }

    if(is_boolean(suffix)){

        if(suffix){

            return name ;
        }

        return name.replace(suffixRe , '') ;
    }
}

const dotRe = /\./g ;

exports.getBinPath = (name , suffix) =>{


}

exports.getSourcePath = (name , suffix) =>{

    
}

exports.name2path = (name , suffix) =>{

    if(name === '*'){

        return '*' ;
    }

    let config = script_parse(name) ;

    if(config === false){

        return false ;
    }

    let {
        scope,
        name:className
    } = config ;

    let sourcePath;

    if(scope){

        sourcePath = exports.getApplicationPath(scope) ;
    
    }else{

        sourcePath = exports.COMPILE_SOURCE_PATH ;
    }

    return path_join(sourcePath , `${name.replace(dotRe , sep)}${suffix ? suffix : ''}`) ;
}

const rootFolderRe = /^[^\\//]+/ ;

exports.path2name = path =>{

    let {
        COMPILE_SOURCE_PATH,
        basename,
        getApplicationPath
    } = exports ;

    if(path.indexOf(COMPILE_SOURCE_PATH) === 0){

        return basename(path , COMPILE_SOURCE_PATH) ;
    }

    return basename(getApplicationPath(path.replace(getApplicationPath() , '').replace(sep , '').match(rootFolderRe)[0])) ;
}

const {
    file:is_file,
} = require('./is');

exports.getFilePath = (path , suffixes) =>{

    let folderPath = dirname(path) ;

    if(is_directory(folderPath)){

        let name = basename(path),
            fileNames = readdirSync(folderPath),
            result = [];

        for(let fileName of fileNames){

            if(fileName.indexOf(name) === 0 && fileName !== name){

                if(suffixes && !suffixes.includes(exports.extname(fileName))){

                    continue ;
                }

                return path_join(folderPath , fileName) ; 
            }
        }
    }
}

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

/*exports.basename = (path , folderPath) =>{

    if(is_defined(folderPath)){

        return path.replace(suffixRe , '').replace(folderPath , '').replace(/^[\\//]/ , '').replace(/[\/\\]/g , '.') ;
    }

    return basename(path) ;
}*/


exports.replaceSuffix = (path , suffix) =>{

    if(suffixRe.test(path)){

        return path.replace(suffixRe , suffix) ;
    }

    return `${path.replace(/[\\\/]$/ , '')}${suffix}` ;
}


exports.getApplicationPath = (path = '') =>{

    return path_join(process.cwd() , path) ;
}

exports.getCompilerPath = path =>{

    return path_join(__dirname , '..' , path) ;
}

const {
    readdirSync
} = require('fs'),
{
    defineProperties
} = require('./object');

defineProperties(exports , {

    COMPILE_SOURCE_PATH:{

        once:true,

        get:() =>{

            let name = properties_get('compile.path.source') ;

            if(!exports.applicationScopeExists(name)){

                throw new Error(`属性文件::compile.path.source 指定不是一个有效的作用域`) ;
            }

            return exports.getApplicationPath(name) ;
        }
    },

    COMPILE_DIST_PATH:{

        once:true,

        get:() =>{

            let name = properties_get('compile.path.dist') ;
            
            if(!exports.applicationScopeExists(name)){

                throw new Error(`属性文件::compile.path.dist 指定不是一个有效的作用域`) ;
            }

            return exports.getApplicationPath(name) ;
        }
    },

    APPLICATION_SCOPE_NAMES:{

        once:true,

        get:() =>{

            let rootPath =  exports.getApplicationPath(),
                names = readdirSync(exports.getApplicationPath()),
                scopeNames = [];

            for(let name of names){

                if(is_directory(path_join(rootPath , name))){
                    
                    scopeNames.push(name) ;
                }
            }

            return scopeNames ;
        }
    }

}) ;