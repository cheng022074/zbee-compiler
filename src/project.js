const {
    defineProperties,
    get:object_get
} = require('./object'),
SourceName = require('./project/source/name'),
SourcePath = require('./project/source/path'),
{
    getSourceFilePath,
    getSourceFilePaths
} = require('./project/path'),
{
    join:path_join
} = require('path'),
{
    readJSONFile,
    readDirectoryNames
} = require('./fs');

defineProperties(exports , {

    PATH:{
        
        once:true,

        get:() =>{

            return process.cwd() ;
        }
    },

    SCOPES:{

        once:true,
        
        get:() =>{
    
            return readDirectoryNames(this.PATH) ;
        }
    },

    PROPERTIES:{

        once:true,
        
        get:() =>{
    
            return readJSONFile(path_join(this.PATH , 'properties.json')) || {};
        }
    },

    BIN_PATH:{

        once:true,

        get:() =>{

            return exports.getScopePath(exports.get('scope.bin')) ;
        }
    },

    DIST_PATH:{

        once:true,
        
        get:() =>{

            return exports.getScopePath(exports.get('scope.dist')) ;
        }
    }

}) ;

exports.get = key =>{

    return object_get(exports.PROPERTIES , key) ;
}

exports.isScope = scope =>{

    return exports.SCOPES.includes(scope) ;
}

exports.getScopePath = scope =>{

    if(!exports.isScope(scope)){

        throw new Error(`${scope} 不是一个有效的作用域`) ;
    }

    return path_join(exports.PATH , scope);
}

exports.getSourcePath = (name , suffixes) =>{

    return getSourceFilePath(new SourceName(exports , name) , suffixes) ;
}

exports.getSourcePaths = (name , suffixes) =>{

    return getSourceFilePaths(new SourceName(exports , name) , suffixes) ;
}

exports.parseSourcePath = path =>{

    return new SourcePath(exports , path) ;
}