const {
    name2path,
    COMPILE_SOURCE_PATH
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
} = require('path');

module.exports = async function(name , target){

    let path = path_join(COMPILE_SOURCE_PATH , name2path(name , '.test.xml'));

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