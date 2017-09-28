const {
    defined:is_defined,
    file:is_file,
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
} = require('../src/properties');

module.exports = (name , ...args) =>{

    if(!is_defined(name)){

        console.info('未指定类名称') ;

        return false;
    }

    let bootPath = properties_get('run.bootPath') ;

    if(is_defined(bootPath)){

        bootPath = path_join(process.cwd() , bootPath) ;

    }else{

        bootPath = process.cwd() ;
    }

    let path = path_join(bootPath , `${name2path(name)}.js`) ;

    if(!is_file(path)){

        console.error(`${name} 不是一个可以运行的程序`) ;

        return false;
    }

    try{

        let result = doExecute(path , args) ;
    
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

function doExecute(path , args){

    let target = require(path) ;

    if(is_function(target)){

        return target(...args) ;
    }
}

function doSuccess(result){

    if(is_defined(result)){

        console.log(result) ;
    }
}

function doFailure(error){

    console.log(error) ;
}