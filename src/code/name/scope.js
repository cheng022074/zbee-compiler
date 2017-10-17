const {
    defineProperty
} = require('../../object'),
{
    readdirSync
} = require('fs'),
{
    directory:is_directory
} = require('../../is'),
{
    join:path_join
} = require('path'),
{
    APPLICATION_PATH
} = require('../../system');

defineProperty(exports , 'APPLICATION_SCOPE_NAMES' , {
        
    once:true,

    get:() =>{

        let rootPath = APPLICATION_PATH,
            names = readdirSync(rootPath),
            scopeNames = [];

        for(let name of names){

            if(is_directory(path_join(rootPath , name))){
                
                scopeNames.push(name) ;
            }
        }

        return scopeNames ;
    }
}) ;

exports.exists = name =>{

    return exports.APPLICATION_SCOPE_NAMES.includes(name) ;
}