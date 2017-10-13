const {
    defined:is_defined,
    file:is_file,
    class:is_class,
    function:is_function
} = require('../src/is'),
{
    join:path_join
} = require('path'),
{
    name2path
} = require('../src/path'),
{
    get:properties_get
} = require('../src/properties'),
{
    execute:script_execute,
    has:script_has
} = require('../src/script');

module.exports = (name , ...args) =>{

    if(!is_defined(name)){

        console.info('未指定类名称') ;

        return false;
    }

    if(!script_has(name)){

        console.error(name , '不是一个可以运行的程序') ;

        return false;
    }

    try{

        let result = script_execute(name , ...args) ;

        if(result instanceof Promise){

            result
                  .then(doSuccess)
                  .catch(doFailure) ;
        }else{

            doSuccess(result) ;
        }

    }catch(err){

        doFailure(err) ;
    }

    

    return true ;
}

function doSuccess(result){

    if(is_defined(result)){

        console.log(result) ;
    }
}

function doFailure(error){

    console.log(error) ;
}