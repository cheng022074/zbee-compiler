const {
    name2path,
    getApplicationPath
} = require('../src/path'),
{
    file:is_file
} = require('../src/is'),
compile = require('./compile'),
{
    execute:script_execute,
    get:script_get
} = require('../src/script'),
{
    join:path_join
} = require('path'),
{
    parse:name_parse
} = require('../src/script/name');

module.exports = async function(name , target){

    let config = name_parse(name) ;

    if(config === false){

        return false ;
    }

    let path = path_join(getApplicationPath(config.scope || 'test') , name2path(name , '.test.xml'));

    if(is_file(path)){

        compile(name) ;

        if(target){

            let testCase = script_get(name) ;

            if(testCase.hasOwnProperty(target)){

                await testCase[target]() ;
            }

        }else{

            await script_execute(name) ;
        }
    }
}