const {
    join:path_join
} = require('path'),
{
    defineProperties
} = require('./object'),
{
    readdirSync
} = require('fs'),
{
    directory:is_directory
} = require('../../is');

defineProperties(exports , {

    APPLICATION_PATH:{

        once:true,

        get:() =>{

            return process.cwd() ;
        }
    },

    APPLICATION_SCOPES:{

        once:true,
        
        get:() =>{
    
            let rootPath = APPLICATION_PATH,
                names = readdirSync(rootPath),
                scopes = [];
    
            for(let name of names){
    
                if(is_directory(path_join(rootPath , name))){
                    
                    scopeNames.push(name) ;
                }
            }
    
            return scopes ;
        }
    },

    COMPILER_PATH:{

        once:true,
        
        get:() =>{

            return path_join(__dirname , '..') ;
        }
    }

}) ;

exports.applicationScopeExists = name =>{

    return exports.APPLICATION_SCOPES.includes(name) ;
}